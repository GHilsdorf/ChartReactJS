import React, { useState, useEffect } from "react";
import "./App.css";

import { Line } from "react-chartjs-2";


export default function App() {

  const [data, setData] = useState({});
  const [minValue, setMinValue] = useState(0);
  const [region, setRegion] = useState('');
  const [rawData, setRawData] = useState([]);


  useEffect(() => {

    fetch('http://localhost:8080/getUsers').then(response => response.json()).then(data => setRawData(data));

  }, [])

  useEffect(() => {

    const filteredRawData = rawData.filter(row => row.spend >= minValue && (region === '' || row.region === region));


    let groupByBirthday = filteredRawData.reduce((acc, it) => {
      acc[it.birthday - 1] = acc[it.birthday - 1] + 1 || 1;
      return acc;
    }, []);

    let groupByCumulative = filteredRawData.reduce((acc, it) => {
      acc[it.birthday - 1] = acc[it.birthday - 1] + 5 || 5;

      return acc;
    }, []);

    for (let i = 1; i < groupByCumulative.length; i++) {
      for (let y = i - 1; y >= 0; y--) {
        if (!!groupByCumulative[y]) {
          groupByCumulative[i] += groupByCumulative[y];
          break;
        }
      }
    }

    setData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Aug", "Sep", "Oct", "Nov", "Dez"],
      datasets: [
        {
          label: "Monthly",
          data: groupByBirthday,
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)",
          spanGaps: true
        },
        {
          label: "Cumulative",
          data: groupByCumulative,
          fill: false,
          borderColor: "#742774",
          spanGaps: true
        }
      ]
    });

  }, [rawData, minValue, region]);



  return (
    <div className="App">
      <label for="minValue">Min. Value (0-5000):</label>
      <input type="number" min="0" max="5000" id="minValue" name="minValue" value={minValue} onChange={event => setMinValue(event.target.value)} />
      <label for="region">Region:</label>
      <select id="region" name="region" value={region} onChange={event => setRegion(event.target.value)} >
        <option value="">All</option>
        <option value="UNITED_STATES">United States</option>
        <option value="APAC">APAC</option>
        <option value="EUROPE">Europe</option>
        <option value="LATIN_AMERICA">Latin America</option>
      </select>
      <Line data={data} />
    </div>
  );
}
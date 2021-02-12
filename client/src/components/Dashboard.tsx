import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart
} from 'react-timeseries-charts';
import { TimeSeries, Index } from "pondjs";

/* import axios from 'axios'; */
import React from 'react';


function Dashboard() {
  async function http<T>(request: RequestInfo): Promise<T> {
    const res = await fetch(request)
    if(!res) {
      throw new Error("response not ok")
    }
    // may error if there is no body, return empty array
    return res.json().catch(() => ({}))
  }
  
  type FlightData = {
    result: string
    table: number
    _start: any
    _stop: any
    _time: number
    _value: number
    _field: string
    _measurement: string
    _flight: string
    _host: string
  }

  
    const data = http<FlightData[]>("http://localhost:8000/speed");
    const series1 = data.then(data => formatData(data))
    .then(data => new TimeSeries(data));
    console.log(series1);

  function formatData(data: FlightData[]) {
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      newData[i] = [data[i]["_time"], data[i]["_value"]];
    };
    console.log(newData);
    console.log(typeof(newData[0]));
    
    return {
      name: 'Speed',
      columns: ["time", "speed"],
      points: newData, 
    };
  }

  /* console.log('here it is:' + Object.values(newData)); */
 /*  const speed = fetch('http://localhost:8000/speed', { method: 'GET'})
  .then(res => res.json())
  .then(res => console.log(res)) */

  /* .then(res => res.text())          // convert to plain text
  .then(text => console.log(text))   */ 

  
  /*  const data1 = {
    name: 'Speed',
    columns: ["time", "speed"],
    points: newData, 
  }; */
  const data2 = {
    name: 'Demanda (Wh) Galpon 2',
    columns: ["time", "Valor"],
    points: [
      [1400425947000, 1000],
      [1400425948000, 2000],
      [1400425949000, 3000],
      [1400425950000, 1500],
      [1400425951000, 2000],
    ]
  };
/*   const series1 = new TimeSeries(data1); */
  const series2 = new TimeSeries(data2);

  return(
       <ChartContainer timeRange={series1.timerange()} width={800}>
        <ChartRow height="200">
          <YAxis id="axis1" label="AsadsjkD" min={0.5} max={1.5} width="60" type="linear" format="$,.2f"/>
          <Charts>
            <LineChart axis="axis1" series={series1} column={["Valor"]}/>
            <LineChart axis="axis2" series={series2} column={["Valor"]}/>
          </Charts>
          <YAxis id="axis2" label="Euro" min={0.5} max={1.5} width="80" type="linear" format="$,.2f"/>
        </ChartRow>
      </ChartContainer>
  

  )}

export default Dashboard;
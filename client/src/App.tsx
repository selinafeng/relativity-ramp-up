import React from "react";
import { TimeSeries } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart
} from "react-timeseries-charts";

function App() {

  const [data, setData] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  // Format of data from endpoint 
  interface Data {
    _result: string
    table: number
    start: string
    stop: string
    value: number,
    field: string
    measurement: string
    flight: string
    host: string
  }

  interface HttpResponse<T> extends Response {
    parsedBody?: T;
  }

  // Retrieves data; parses body 
  async function http<T>(
    request: RequestInfo
  ): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(request);
    try {
      response.parsedBody = await response.json();
    } catch (ex) { }

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  }

  // Consumer 
  async function getData() {
    let response: HttpResponse<Data[]>;
    try {
      response = await http<Data[]>("http://localhost:3000/acceleration")
      console.log("response: ", response);
    } catch (response) {
      console.log("Error: ", response);
    }
  }

  function rawToFormattedData(res: Response) {
    // setData(getData()); 
  }

  function helper() {
    if (loaded) {

    }
  }

  getData();
  return (
    <div>{getData()}</div>
    // getData()
  )

}

export default App; 

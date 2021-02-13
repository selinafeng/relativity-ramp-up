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
  const testData = ["hi", 1, "hi", "hi", 3, "h", "hi", "hi", "hi"];

  // Format of data from endpoint 
  interface Data {
    result: string;
    table: number;
    _start: string;
    _stop: string;
    _time: number;
    _value: number;
    _field: string;
    _measurement: string;
    _flight: string;
    _host: string;
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
  async function getData(url: string) {
    let response: HttpResponse<Data[]>;
    try {
      response = await http<Data[]>(url);
      console.log("response", response);
      return data;
    } catch (response) {
      console.log("Error: ", response);
    }
  }

  getData("http://localhost:8000/altitude");

  return (
    <div>
      <h3>
        Visualization
      </h3>
      {/* {getData()} */}
    </div>
    // getData()
  )

}

export default App; 

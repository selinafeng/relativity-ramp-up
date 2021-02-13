// client/src/components/Dashboard.js
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";
import { Component } from "react";
import { ReactComponent } from "*.svg";

export default class DashBoard extends Component<
  {},
  { result: dataRocket | null }
> {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
  }

  //run once when the component is first rendered
  componentDidMount() {
    const response: dataRocket = dataChangeType(
      fetch("http://localhost:3000/engines")
    );

    this.setState({ result: response });
  }

  //put graphs here
  render() {
    return <div>{this.state.result}</div>;
  }
}

function dataChangeType(res: Promise<Response>) {
  var x: dataRocket = {
    result: "dummy r",
    table: 1,
    _start: "dummy r",
    _stop: "dummy r",
    _value: 1,
    _measurement: "dummy r",
    flight: "dummy r",
    host: "dummy r",
  };

  return x;
}

// async function http<T>(request: RequestInfo): Promise<T> {
//   const response = await fetch(request);
//   const body = await response.json();
//   return body;
// }

interface dataRocket {
  result: string;
  table: number;
  _start: string;
  _stop: string;
  _value: number;
  _measurement: string;
  flight: string;
  host: string;
}

// async function http<dataRocket>(request: RequestInfo): Promise<any> {
//   const response = await fetch(request);
//   try {
//     const body = await response.json();
//     console.log(body);
//     return body;
//   } catch (ex) {}
//   if (!response.ok) {
//     throw new Error(response.statusText);
//   }
// }

// function DashBoard() {
//   //   const data = http<dataRocket>("http://localhost:3000/engines");
//   const response = await fetch("http://localhost:3000/engines");
//   console.log(response);

//   return <div> 5 </div>;
// }

//   const s1: dataRocket = FormatData("http://localhost:3000/engines");

// //format the data into a FlightData
// async function FormatData(hyperLink: string) {
//   try {
//     var res: Response = await fetch(hyperLink);
//     var data: dataRocket = {
//       result: "dummy results",
//       table: -1,
//       _start: "START OFF",
//       _stop: "END TIME",
//       _value: 9000,
//       _measurement: "dummy measurement",
//       flight: "dummy flight",
//       host: "dummy host",
//     };
//     return data;
//   } catch (err) {
//     console.log("rip");
//   }
// }

//   return (
//     <ChartContainer timeRange={s1.timerange()} width={800}>
//       <ChartRow height="200">
//         <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" />
//         <Charts>
//           <LineChart axis="axis1" series={series1} column={["aud"]} />
//           <LineChart axis="axis2" series={series2} column={["euro"]} />
//         </Charts>
//         <YAxis id="axis2" label="Euro" min={0.5} max={2.0} width="80" />
//       </ChartRow>
//     </ChartContainer>
//   );

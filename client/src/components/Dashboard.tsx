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
import { Http2ServerRequest } from "http2";
import React from "react";
import { TimeSeries, Time, TimeRange } from "pondjs";

export default class DashBoard extends Component<
  {},
  { result: TimeSeries<Time> | null }
> {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
  }

  //run once when the component is first rendered
  async componentDidMount() {
    console.log("ack");
    var altData = await this.http("http://localhost:8000/altitude");

    // const response = await dataChangeType(
    //   fetch("http://localhost:8000/engines")
    // );

    var series: TimeSeries<Time> = this.formatData(altData, "altitude");
    console.log(series);

    this.setState({ result: altData });
  }
  //put graphs here
  render() {
    // return <div>Hello</div>;

    //set up the timeRange
    var beginTime: Time = new Time("2021-02-05T21:13:29.690Z");
    var endTime: Time = new Time("2021-02-05T21:18:29.690");
    var range: TimeRange = new TimeRange(beginTime, endTime);

    if (this.state.result == null) {
      return <div> Loading!</div>;
    } else {
      return (
        // takes a TimeRange object, need to figure out how to find it
        // t TimeRange = new TimeRanges

        <ChartContainer timeRange={range} width={800}>
          <ChartRow height="200">
            <YAxis id="axis1" label="AUD" min={0.5} max={1.5} width="60" />
            <Charts>
              <LineChart
                axis="axis1"
                series={this.state.result}
                column={["aud"]}
              />
              <LineChart
                axis="axis2"
                series={this.state.result}
                column={["euro"]}
              />
            </Charts>
            <YAxis id="axis2" label="Euro" min={0.5} max={2.0} width="80" />
          </ChartRow>
        </ChartContainer>
      );
    }
  }

  //function that helps with the request
  async http(request: RequestInfo): Promise<any> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
  }

  formatData(data: any, nameP: string) {
    // console.log("in format data:");
    // console.log(data);
    // console.log(data[0]["_start"]);
    // data = data.map((point) => [point["_start"], point["_value"]]);
    // console.log()
    // const series: TimeSeries<Time> = new TimeSeries({
    //   name: nameP,
    //   columns: ["time", "value"],
    //   points: data,
    // });

    const series = new TimeSeries({
      name: "traffic",
      columns: ["time", "in", "out"],
      points: [
        [1400425947000, 52, 12],
        [1400425948000, 18, 42],
        [1400425949000, 26, 81],
        [1400425950000, 93, 11],
      ],
    });
    console.log(series);

    return series;
  }
}

// function dataChangeType(res: Promise<Response>) {
//   console.log(res);
//   var x: dataRocket = {
//     result: "dummy r",
//     table: 1,
//     _start: "dummy r",
//     _stop: "dummy r",
//     _value: 1,
//     _measurement: "dummy r",
//     flight: "dummy r",
//     host: "dummy r",
//   };

//   return x;
// }

// async function http<T>(request: RequestInfo): Promise<T> {
//   const response = await fetch(request);
//   const body = await response.json();
//   return body;
// }

// interface dataRocket {
//   result: string;
//   table: number;
//   _start: string;
//   _stop: string;
//   _value: number;
//   _measurement: string;
//   flight: string;
//   host: string;
// }

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

// client/src/components/Dashboard.js
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
} from "react-timeseries-charts";
import { Component } from "react";
import { ReactComponent } from "*.svg";
import { Http2ServerRequest } from "http2";
import React from "react";
import { TimeSeries, timeSeries, Time, TimeRange } from "pondjs";

export default class DashBoard extends Component<
  {},
  { result: TimeSeries<Time> | null }
> {
  //don't need to touch this anymore!
  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
  }

  //helper function that makes http get request
  async http(request: RequestInfo): Promise<any> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
  }

  //run once when the component is first rendered
  async componentDidMount() {
    var altData = await this.http("http://localhost:8000/altitude");

    var series = this.formatData(altData, "altitude");
    console.log(series.timerange());
    console.log(series);

    this.setState({ result: series });
  }

  //put graphs here
  render() {
    // return <div>Hello</div>;

    //set up the timeRange

    if (this.state.result == null) {
      return <div> Loading!</div>;
    } else {
      return (
        // takes a TimeRange object, need to figure out how to find it
        // t TimeRange = new TimeRanges

        // <ChartContainer timeRange={this.state.result.range()} width={800}>
        //   <ChartRow height="200">
        //     <YAxis id="axis1" label="VALUEEE" width="60" />
        //     <Charts>
        //       <LineChart
        //         axis="axis1"
        //         series={this.state.result}
        //         column={["value"]}
        //       />
        //       <LineChart
        //         axis="axis2"
        //         series={this.state.result}
        //         column={["value"]}
        //       />
        //     </Charts>
        //     <YAxis id="axis2" label="VALUUEUEU" width="80" />
        //   </ChartRow>
        // </ChartContainer>

        //dummy bar chart
        <div>
          <div className="row">
            <div className="col-md-12">
              <b>BarChart</b>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-12">
              <Resizable>
                <ChartContainer timeRange={this.state.result.range()}>
                  <ChartRow height="150">
                    <Charts>
                      <YAxis
                        id="price"
                        label="Price ($)"
                        min={this.state.result.min()}
                        max={this.state.result.max()}
                        width="60"
                        format="$,.2f"
                      />
                      <LineChart
                        axis="price"
                        series={this.state.result}
                        column={["value"]}
                      />
                    </Charts>
                  </ChartRow>
                </ChartContainer>
              </Resizable>
            </div>
          </div>
        </div>
      );
    }
  }

  formatData(data: any, nameP: string) {
    console.log("in format data:");

    data = data.map((point) => [point["_start"], point["_value"]]);
    console.log();
    const series = timeSeries({
      name: nameP,
      columns: ["time", "value"],
      points: data,
    });

    //dummy data
    // const series = timeSeries({
    //   name: "traffic",
    //   columns: ["time", "value"],
    //   points: [
    //     [1400425947000, 52],
    //     [1400425948000, 18],
    //     [1400425949000, 26],
    //     [1400425950000, 93],
    //   ],
    // });

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

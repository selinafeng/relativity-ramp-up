// client/src/components/Dashboard.js
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";
import { Component } from "react";
import React from "react";
import { TimeSeries, TimeEvent } from "pondjs";

export default class DashBoard extends Component<{}, { result: any | null }> {
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
    var engData = await this.http("http://localhost:8000/engines");
    var accelData = await this.http("http://localhost:8000/accel");

    //add altitude data
    var dictOfSeries = {};
    var altSeries = this.formatData(altData, "altitude");
    dictOfSeries["altitude"] = altSeries;

    var engineSeries = this.formatData(engData, "engines");
    dictOfSeries["engines"] = engineSeries;
    console.log(engineSeries);

    var accelSeries = this.formatData(accelData, "accel");
    dictOfSeries["accel"] = accelSeries;

    this.setState({ result: dictOfSeries });
  }

  //put graphs here
  render() {
    // return <div>Hello</div>;

    //set up the timeRange

    if (this.state.result == null) {
      return <div> Loading!</div>;
    } else {
      console.log("above this");
      return (
        // takes a TimeRange object, need to figure out how to find it
        // t TimeRange = new TimeRanges
        <div>
          <ChartContainer
            timeRange={this.state.result["altitude"].timerange()}
            width={800}
          >
            <ChartRow height="200">
              <YAxis
                id="alt"
                label="Altitude"
                min={this.state.result["altitude"].min()}
                max={this.state.result["altitude"].max()}
                width="60"
              />
              <Charts>
                <LineChart
                  axis="alt"
                  series={this.state.result["altitude"]}
                  column={["time"]}
                />
              </Charts>
            </ChartRow>
          </ChartContainer>

          {/* <ChartContainer
            timeRange={this.state.result["engines"].timerange()}
            width={800}
          >
            <ChartRow height="200">
              <YAxis
                id="engine"
                label="Engine Values"
                min={this.state.result["engines"].min()}
                max={this.state.result["engines"].max()}
                width="60"
              />
              <Charts>
                <LineChart
                  axis="engine"
                  series={this.state.result["engines"]}
                  column={["engines"]}
                />
              </Charts>
            </ChartRow>
          </ChartContainer> */}

          <ChartContainer
            timeRange={this.state.result["accel"].timerange()}
            width={800}
          >
            <ChartRow height="200">
              <YAxis
                id="accel"
                label="Acceleration Values"
                min={this.state.result["accel"].min()}
                max={this.state.result["accel"].max()}
                width="60"
              />
              <Charts>
                <LineChart
                  axis="accel"
                  series={this.state.result["accel"]}
                  column={["accel"]}
                />
              </Charts>
            </ChartRow>
          </ChartContainer>

        </div>
      );
    }
  }

  formatData(data: any, nameP: string) {
    console.log("in format data:");

    // data = data.map((point) => [point["_start"], point["_value"]]);
    // const series = timeSeries({
    //   name: nameP,
    //   columns: ["time", "value"],
    //   points: data,
    // });

    var events = data.map(
      (point) =>
        new TimeEvent(new Date(point["_time"]), {
          value: point["_value"],
        })
    );

    console.log(events);

    const series = new TimeSeries({
      name: nameP,
      events: events,
    });
    console.log("BELOW");
    console.log(data);
    console.log("ABOVE");

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

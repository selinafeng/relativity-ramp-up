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
  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
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

    //engine data 1
    var engineSeries1 = this.formatData(engData, "engine-1");
    dictOfSeries["engine-1"] = engineSeries1;

    //engine data 2
    var engineSeries2 = this.formatData(engData, "engine-2");
    dictOfSeries["engine-2"] = engineSeries2;

    //engine data 3
    var engineSeries3 = this.formatData(engData, "engine-3");
    dictOfSeries["engine-3"] = engineSeries3;

    //get acceleration data
    var accelSeries = this.formatData(accelData, "accel");
    dictOfSeries["accel"] = accelSeries;

    this.setState({ result: dictOfSeries });
  }

  //put graphs here
  render() {
    if (this.state.result == null) {
      return <div> Loading!</div>;
    } else {
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

          <ChartContainer
            timeRange={this.state.result["engine-1"].timerange()}
            width={800}
          >
            <ChartRow height="200">
              <YAxis
                id="engine"
                label="Engine Values"
                min={this.state.result["engine-1"].min()}
                max={this.state.result["engine-1"].max()}
                width="60"
              />
              <Charts>
                <LineChart
                  axis="engine"
                  series={this.state.result["engine-1"]}
                  column={["time"]}
                />
                <LineChart
                  axis="engine"
                  series={this.state.result["engine-2"]}
                  column={["time"]}
                />
                <LineChart
                  axis="engine"
                  series={this.state.result["engine-3"]}
                  column={["time"]}
                />
              </Charts>
            </ChartRow>
          </ChartContainer>

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

  //helper function that makes http get request
  async http(request: RequestInfo): Promise<any> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
  }

  //helper function to parse the request
  formatData(data: any, nameP: string) {
    if (nameP.startsWith("e")) {
      data = data.filter((point) => point["_measurement"] === nameP);
    }

    var events = data.map(
      (point) =>
        new TimeEvent(new Date(point["_time"]), {
          value: point["_value"],
        })
    );

    const series = new TimeSeries({
      name: nameP,
      events: events,
    });

    return series;
  }
}

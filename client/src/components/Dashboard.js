import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";
import { TimeSeries } from "pondjs";

import React, { Component } from "react";

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  async componentDidMount() {
    const endpoints = [
      "calculate-acceleration",
      "aggregate-engines",
      "get-all-altitude",
    ];
    const futures = endpoints.map(async (e) => {
      const response = await fetch(`http://localhost:4000/${e}`);
      return response.json();
    });
    const data = await Promise.all(futures);
    this.setState({
      data: data,
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {data.length > 0 &&
          data.map((d) => {
            const series = new TimeSeries({
              name: d["graphTitle"],
              columns: ["time", "data"],
              points: d["data"].map((v) => [
                Date.parse(v["_time"]),
                parseFloat(v["_value"]),
              ]),
            });
            return (
              <div
                key={d["graphTitle"]}
                style={{ width: 1000, margin: "auto" }}
              >
                <h1 style={{ textAlign: "center" }}>{d["graphTitle"]}</h1>
                <ChartContainer
                  timeRange={series.timerange()}
                  width={1000}
                  format={(d) => {
                    return d.getTime() / 1000;
                  }}
                >
                  <ChartRow height="200">
                    <YAxis
                      id="axis1"
                      label={d["y"]}
                      min={0}
                      max={Math.max.apply(
                        Math,
                        d["data"].map((v) => parseFloat(v["_value"]))
                      )}
                      width="60"
                    />
                    <Charts>
                      <LineChart
                        axis="axis1"
                        series={series}
                        columns={["data"]}
                      />
                    </Charts>
                  </ChartRow>
                </ChartContainer>
              </div>
            );
          })}
      </div>
    );
  }
}

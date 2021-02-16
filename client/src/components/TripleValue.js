import React from "react"
import { TimeSeries, TimeRange, Index } from "pondjs";

import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
} from "react-timeseries-charts"

class TripleValue extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            url: props.url,
            loaded: false,
            data: {
                name: props.name,
                columns: ["index", "value1", "value2", "value3"],
                points: []
            },
        }
        this.process = this.process.bind(this)
    }

    componentDidMount() {
        // make API call
        fetch(this.state.url, {mode: 'cors'})
        .then((response) => response.json())
        .then((data) => {
            this.process(data)
        }).catch(console.log)
    }

    process(data) {
        // add length check
        let save_min = data[0][0]["_value"]
        let save_max = data[0][0]["_value"]
        let new_data = this.state.data
        for (let engine_num = 0; engine_num < data.length; engine_num += 1) {
            let engine = data[engine_num]
            for (let i = 0; i < engine.length; i += 1) {
                if (engine_num == 0) {
                    new_data["points"].push([Index.getIndexString("0.001s", new Date(engine[i]["_time"])), engine[i]["_value"], null, null])
                } else if (i < data[0].length) {
                    new_data["points"][i][engine_num + 1] = engine[i]["_value"]
                } else {
                    console.log("Unexpected data", i, data[0])
                }
                save_min = Math.min(save_min, engine[i]["_value"])
                save_max = Math.max(save_max, engine[i]["_value"])
            }
        }
        this.setState(
            { 
                loaded: true,
                min: save_min,
                max: save_max,
                data: new_data,
                timeseries: new TimeSeries(new_data)
            }
        )
    }
    
    render() {
        if (!this.state.loaded) {
            return (
                <div>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return (
                <div>
                    <h1 style={{textAlign: "left", marginLeft: "5vw"}}>{this.state.data["name"]} vs Time</h1>
                    <ChartContainer timeRange={this.state.timeseries.timerange()}>
                        <ChartRow height="300">
                            <YAxis
                                id="y"
                                label={this.state.data["name"]}
                                min={this.state.min}
                                max={this.state.max}
                                type="linear"
                            />
                            <Charts>
                                <LineChart 
                                    axis="y"
                                    breakLine={false}
                                    series={this.state.timeseries}
                                    columns={["value1", "value2", "value3"]}
                                    interpolation="curveBasis"
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </div>
            )
        }
    }
}

export default TripleValue;
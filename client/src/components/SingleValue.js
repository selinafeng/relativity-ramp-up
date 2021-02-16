import React from "react"
import { TimeSeries, Index } from "pondjs";

import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
} from "react-timeseries-charts"

class SingleValue extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            url: props.url,
            loaded: false,
            data: {
                name: props.name,
                columns: ["index", "value"],
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
        let save_min = data[0]["_value"]
        let save_max = data[0]["_value"]
        let new_data = this.state.data
        for (let i = 0; i < data.length; i += 1) {
            new_data["points"].push([Index.getIndexString("0.001s", new Date(data[i]["_time"])), data[i]["_value"]])
            save_min = Math.min(save_min, data[i]["_value"])
            save_max = Math.max(save_max, data[i]["_value"])
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
                                    columns={["value"]}
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

export default SingleValue;
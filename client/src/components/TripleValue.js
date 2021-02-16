// import { time } from "console";
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
        let save_min = data[1]["_value"]
        let save_max = data[1]["_value"]
        let new_data = this.state.data
        let start_1 = data[0]["start_1"]
        let start_2 = data[0]["start_2"]
        let start_3 = data[0]["start_3"]
        console.log("STARTS:")
        console.log(start_1, start_2, start_3)
        for (let i = start_1; i < start_2; i += 1) {
            new_data["points"].push([Index.getIndexString("0.001s", new Date(data[i]["_time"])), data[i]["_value"], null, null])
            save_min = Math.min(save_min, data[i]["_value"])
            save_max = Math.max(save_max, data[i]["_value"])
        }
        for (let i = start_2; i < start_3; i += 1) {
            new_data["points"][i - start_2][2] = data[i]["_value"]
            save_min = Math.min(save_min, data[i]["_value"])
            save_max = Math.max(save_max, data[i]["_value"])
        }
        for (let i = start_3; i < data.length; i += 1) {
            new_data["points"][i - start_3][3] = data[i]["_value"]
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
                    <ChartContainer timeRange={this.state.timeseries.timerange()} enablePanZoom={true}>
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
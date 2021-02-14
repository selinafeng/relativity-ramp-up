import React from "react";
import { TimeSeries, TimeEvent, time } from "pondjs";
import {
    Charts,
    BarChart,
    ChartContainer,
    ChartRow,
    Resizable,
    Styler,
    YAxis,
    LineChart
} from "react-timeseries-charts";

function Dashboard() {
    const [data, setData] = React.useState(null);
    const tempSeries = new TimeSeries({
        name: "temp",
        columns: ["time", "value"],
        points: [
            [1400425947000, 1000],
            [1400425948000, 2000],
        ],
    });
    const [altitudeData, setAltitudeData] = React.useState(tempSeries);
    const [accelerationData, setAccelerationData] = React.useState(tempSeries);
    const [engine1Data, setEngine1Data] = React.useState(tempSeries);
    const [engine2Data, setEngine2Data] = React.useState(tempSeries);
    const [engine3Data, setEngine3Data] = React.useState(tempSeries);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(timeSeriesFormatAll);

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
    async function getData(url: string, measurement: string, setter: Function) {
        let response: HttpResponse<Data[]>;
        try {
            response = await http<Data[]>(url);
            if (response.parsedBody != undefined) {
                const body: Data[] = response.parsedBody;
                console.log(body);
                if (measurement == "Engines") {
                    engineTimeSeriesDataFormat(body, "engine-1", setEngine1Data);
                    engineTimeSeriesDataFormat(body, "engine-2", setEngine2Data);
                    engineTimeSeriesDataFormat(body, "engine-3", setEngine3Data);
                }
                else {
                    timeSeriesDataFormat(body, measurement, setter);
                }
            }
        } catch (response) {
            console.log("Error: ", response);
        }
    }

    // Formats the json data into a format readible by TimeSeries 
    function timeSeriesDataFormat(jsonData: Data[], varName: string, setter: Function) {
        let pointsRaw: any[];
        pointsRaw = [];
        for (let i = 0; i < jsonData.length; i++) {
            const date = new Date(jsonData[i]["_time"]);
            pointsRaw.push(new TimeEvent(date, { value: jsonData[i]["_value"] }));
        }
        const series = new TimeSeries({
            name: varName,
            columns: ["time", "value"],
            events: pointsRaw
        });
        setter(series);
        setLoading(false);
    }

    // Formats the engine json data 
    function engineTimeSeriesDataFormat(jsonData: Data[], varName: string, setter: Function) {
        let pointsRaw: any[];
        pointsRaw = [];
        for (let i = 0; i < jsonData.length; i++) {
            const engine = jsonData[i]["_measurement"];
            if (engine == varName) {
                const date = new Date(jsonData[i]["_stop"]);
                pointsRaw.push(new TimeEvent(date, { value: jsonData[i]["_value"] }));
            }
        }
        const series = new TimeSeries({
            name: varName,
            columns: ["time", "value"],
            events: pointsRaw
        });
        setter(series);
        setLoading(false);
    }

    // Peforms all neecssary functions on all 3 endpoints 
    function timeSeriesFormatAll() {
        getData("http://localhost:8000/altitude", "Altitude", setAltitudeData);
        getData("http://localhost:8000/acceleration", "Acceleration", setAccelerationData);
        getData("http://localhost:8000/engine", "Engines", setEngine1Data);
    }

    function renderAllCharts() {
        return (
            <div>
                <ChartContainer timeRange={altitudeData.timerange()}>
                    <ChartRow height="500">
                        <YAxis id="axis1" label="ALTITUDE" width="60" min={altitudeData.min()} max={altitudeData.max()} />
                        <Charts>
                            <LineChart axis="axis1" series={altitudeData} />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
                <ChartContainer timeRange={accelerationData.timerange()}>
                    <ChartRow height="500">
                        <YAxis id="axis1" label="ACCELERATION" width="60" min={accelerationData.min()} max={accelerationData.max()} />
                        <Charts>
                            <LineChart axis="axis1" series={accelerationData} />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
                <ChartContainer timeRange={engine1Data.timerange()}>
                    <ChartRow height="500">
                        <YAxis id="axis1" label="ENGINES" width="60" min={engine1Data.min()} max={engine1Data.max()} />
                        <Charts>
                            <LineChart axis="axis1" series={engine1Data} />
                            <LineChart axis="axis1" series={engine2Data} />
                            <LineChart axis="axis1" series={engine3Data} />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </div>
        )
    }

    if (!loading) {
        return (
            <div>{renderAllCharts()}</div>
        )
    }
    else {
        return (
            <div>Loading...</div>
        )
    }

}

export default Dashboard; 
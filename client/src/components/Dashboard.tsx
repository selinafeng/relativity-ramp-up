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
    async function getData(url: string) {
        let response: HttpResponse<Data[]>;
        try {
            response = await http<Data[]>(url);
            if (response.parsedBody != undefined) {
                const body: Data[] = response.parsedBody;
                console.log(body);
                const data = timeSeriesDataFormat(body, "hi");
                return data;
            }
        } catch (response) {
            console.log("Error: ", response);
        }
    }

    // Formats the json data into a format readible by TimeSeries 
    // function timeSeriesDataFormat(jsonData: Data[], varName: string) {
    //     let pointsRaw: any[][];
    //     pointsRaw = [];
    //     for (let i = 0; i < jsonData.length; i++) {
    //         const date = new Date(jsonData[i]["_time"]);
    //         // const e = new Event(date.getTime(), jsonData[i]["_value"]);
    //         pointsRaw.push([date.getTime(), jsonData[i]["_value"]]);
    //     }
    //     const series = new TimeSeries({
    //         name: varName,
    //         columns: ["time", "value"],
    //         points: pointsRaw
    //     });
    //     setAltitudeData(series);
    //     console.log(series.toString());
    // }

    // Formats the json data into a format readible by TimeSeries 
    function timeSeriesDataFormat(jsonData: Data[], varName: string) {
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
        setAltitudeData(series);
    }

    // Peforms all neecssary functions on all 3 endpoints 
    // function timeSeriesFormatAll() {
    //     setAltitudeData(timeSeriesDataFormat(____)); 
    // }

    function renderAllCharts() {

    }

    getData("http://localhost:8000/altitude");
    if (typeof altitudeData != undefined) {
        return (
            <ChartContainer timeRange={altitudeData.timerange()}>
                <ChartRow height="500">
                    <YAxis id="axis1" label="VALUE" width="60" min={altitudeData.min()} max={altitudeData.max()} />
                    <Charts>
                        <LineChart axis="axis1" series={altitudeData} />
                    </Charts>
                </ChartRow>
            </ChartContainer>

        )
    }
    else {
        return (
            <div>Loading...</div>
        )
    }

}

export default Dashboard; 

import React from "react";
import { TimeSeries, timeEvent, time } from "pondjs";
import * as Immutable from 'immutable';
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
import { TimeEventObject } from "pondjs/lib/event";

function Dashboard() {

    const [data, setData] = React.useState(null);
    const tempSeries = new TimeSeries({
        name: "temp",
        columns: ["time", "value"],
        points: [
            ["1h-412568", 0.01],
            ["1h-412569", 0.13],
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
            // const e = new Event(date.getTime(), jsonData[i]["_value"]);
            // pointsRaw.push([date.getTime(), jsonData[i]["_value"]]);
            pointsRaw.push(timeEvent(time(date), Immutable.Map({ value: 14 })));
        }
        const series = new TimeSeries({
            name: varName,
            columns: ["time", "value"],
            points: pointsRaw
        });
        setAltitudeData(series);
        console.log(series.timerange().toString());
    }

    // Peforms all neecssary functions on all 3 endpoints 
    // function timeSeriesFormatAll() {
    //     setAltitudeData(timeSeriesDataFormat(____)); 
    // }

    function renderAllCharts() {

    }

    getData("http://localhost:8000/altitude");

    return (
        <div>hi</div>
    )

}

export default Dashboard; 

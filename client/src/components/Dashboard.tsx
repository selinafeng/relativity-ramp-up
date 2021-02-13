import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart
} from "react-timeseries-charts";

function Dashboard() {

    // Format of data from endpoint 
    interface data {
        _result: string
        table: number
        start: string
        stop: string
        value: number,
        field: string
        measurement: string
        flight: string
        host: string
    }

    async function getData() {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos"
        );
        const body = await response.json();
        return body;
    }

    function rawToFormattedData(res: Response) {

    }

    return (
        // <div>Your visualizations go here</div>
        getData()
    )

}

export default Dashboard;

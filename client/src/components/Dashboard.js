import {
    Charts,
    ChartContainer,
    ChartRow,
    YAxis,
    LineChart,
} from "react-timeseries-charts";
import React, { useState } from "react";
import { TimeSeries, TimeEvent } from "pondjs";



function Dashboard() {
    const [alt, setAlt] = useState(null);
    const [en1, setEn1] = useState(null);
    const [en2, setEn2] = useState(null);
    const [en3, setEn3] = useState(null);
    const [accel, setAccel] = useState(null);

    function reconstructData(title, data) {
        var timeseries = []
        for (let i = 0; i < data.length; i++) {
            var date = new Date(data[i]["_time"]);
            timeseries[i] = new TimeEvent(date, { value: data[i]["_value"] });
        }
        const series = new TimeSeries({
            name: title,
            events: timeseries,
        });
        return series;
    }

    function reconstructEngineData(title, data) {
        data = data.filter((point) => point["_measurement"] === title);
        var timeseries = []
        for (let i = 0; i < data.length; i++) {
            var date = new Date(data[i]["_time"]);
            timeseries[i] = new TimeEvent(date, { value: data[i]["_value"] });
        }
        const series = new TimeSeries({
            name: title,
            events: timeseries,
        });
        return series;
    }

    async function componentDidMount() {
        var response = await fetch("http://localhost:5000/altitude");
        var altitude = await response.json();
        altitude = reconstructData("altitude", altitude);
        setAlt(altitude);

        response = await fetch("http://localhost:5000/engines");
        var engines = await response.json();
        var engine1 = reconstructEngineData("engine-1", engines);
        setEn1(engine1);
        var engine2 = reconstructEngineData("engine-2", engines);
        setEn2(engine2);
        var engine3 = reconstructEngineData("engine-3", engines);
        setEn3(engine3);

        response = await fetch("http://localhost:5000/acceleration");
        var acceleration = await response.json();
        acceleration = reconstructData("acceleration", acceleration);
        setAccel(acceleration);
    }

    componentDidMount();
    if (alt != null && en1 != null && en2 != null && en3 != null && accel != null) {
        return (
            <div>
                <div>Altitude</div>
                <ChartContainer timeRange={alt.timerange()} width={1000}>
                    <ChartRow height="300">
                        <YAxis
                            id="alt"
                            label="Altitude"
                            min={alt.min()}
                            max={alt.max()}
                            width="60"
                        />
                        <Charts>
                            <LineChart axis="alt" series={alt} column={["time"]} />
                        </Charts>
                    </ChartRow>
                </ChartContainer>

                <div>Engines</div>
                <ChartContainer timeRange={en1.timerange()} width={1000}>
                    <ChartRow height="300">
                        <YAxis
                            id="engine"
                            label="Engine"
                            min={en1.min()}
                            max={en1.max()}
                            width="60"
                        />
                        <Charts>
                            <LineChart axis="engine" series={en1} column={["time"]} />
                            <LineChart axis="engine" series={en2} column={["time"]} />
                            <LineChart axis="engine" series={en3} column={["time"]} />
                        </Charts>
                    </ChartRow>
                </ChartContainer>

                <div>Acceleration</div>
                <ChartContainer timeRange={accel.timerange()} width={1000}>
                    <ChartRow height="300">
                        <YAxis
                            id="accel"
                            label="Acceleration"
                            min={accel.min()}
                            max={accel.max()}
                            width="60"
                        />
                        <Charts>
                            <LineChart axis="accel" series={accel} column={["time"]} />
                        </Charts>
                    </ChartRow>
                </ChartContainer>
            </div>
        );
    }
    else {
        return (
            <div>
                loading data...
                    </div>
        )
    }
}

export default Dashboard;

import { TimeSeries, TimeEvent} from "pondjs";
import React from 'react';
import Chart from '../Chart';
import './Dashboard.css';
import loader from '../../assets/loader.gif';



function Dashboard() {

  const tempSeries = new TimeSeries({
    name: "temp",
    columns: ["time", "value"],
    points: [
      [1400425947000, 1000],
      [1400425948000, 2000]]
});
  const [loaded, setLoaded] = React.useState(false);
  const [speedSeries, setSpeedSeries] = React.useState(tempSeries);
  const [altSeries, setAltSeries] = React.useState(tempSeries);
  const [accSeries, setAccSeries] = React.useState(tempSeries);
  const [acc2Series, setAcc2Series] = React.useState(tempSeries);

  interface FlightData {
    result: string
    table: number
    _start: any
    _stop: any
    _time: number
    _value: number
    _field: string
    _measurement: string
    _flight: string
    _host: string
  }
 

  React.useEffect(() => {
    
  const fetchData = async (url: RequestInfo): Promise<FlightData[]> => {
    const response = await fetch(url)
    const data = response.json()
    console.log(data);
    return data
}

  const runAsyncFunctions = async () => {
    try {
        const speedSeriesData = await fetchData('http://localhost:8000/speed')
        const altSeriesData = await fetchData('http://localhost:8000/altitude')
        const accSeriesData = await fetchData('http://localhost:8000/acceleration')
        const acc2SeriesData = await fetchData('http://localhost:8000/acceleration2')
        let formattedData = formatData(speedSeriesData);
        setSpeedSeries(new TimeSeries({ name: 'Speed',
        columns: ["time", "value"],
        events: formattedData,
        }));
        formattedData = formatData(altSeriesData);
        setAltSeries(new TimeSeries({ name: 'Altitude',
        columns: ["time", "value"],
        events: formattedData,
        }));
        formattedData = formatData(accSeriesData);
        setAccSeries(new TimeSeries({ name: 'Acceleration',
        columns: ["time", "value"],
        events: formattedData,
        }));
        formattedData = formatData(acc2SeriesData);
        setAcc2Series(new TimeSeries({ name: 'Acceleration 2',
        columns: ["time", "value"],
        events: formattedData,
        }));
        
        setLoaded(true);
        console.log("success?")
    } catch (error) {
        console.log(error)
    }
}
runAsyncFunctions();
  });
  

function formatData(data: FlightData[]) {
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    let tempTime = new Date(data[i]["_time"]);
    newData[i] = new TimeEvent(tempTime, {value: data[i]["_value"]});
  };
  return newData;
}


  function renderChart() {
    if (loaded) {
      return(<div className="all-charts">
        <Chart className="chart" series={speedSeries} min={0} max={15000} label="Speed"/>
        <Chart className="chart" series={altSeries} min={0} max={150000000} label="Altitude" />
        <Chart className="chart" series={accSeries} min={-1000} max={1000} label="Acceleration"/>
        {/* <Chart series={acc2Series} min={-15000} max={15000} label="Acceleration2"/> */}
        </div>);
    } else {
      return<img className="loader" src={loader} alt="loader" />
    }
  }

  return(<div className="container"><div className="flex-container">{renderChart()}</div></div>
    
  )}

export default Dashboard;
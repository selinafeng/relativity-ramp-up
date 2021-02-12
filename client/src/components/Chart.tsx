import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";

function Chart(props: any) {
  return (
    <ChartContainer timeRange={props.series.timerange()} width={650}>
      <ChartRow height="250">
        <YAxis
          id="axis1"
          label={props.label}
          min={props.min}
          max={props.max}
          width="60"
          type="linear"
        />
        <Charts>
          <LineChart axis="axis1" series={props.series} column={["value"]} />
        </Charts>
      </ChartRow>
    </ChartContainer>
  );
}

export default Chart;

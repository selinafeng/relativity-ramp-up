import express from "express";
import { InfluxDB } from "@influxdata/influxdb-client";

// These are values that we provide from our InfluxDB instance.
// In the real project, these should go in a .env file!
const token =
  "kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA==";
const org = "codebase-relativity";
const bucket = "relativity-ramp-up";
const url = "https://us-west-2-1.aws.cloud2.influxdata.com";

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);
export const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send("Hello Worlds!");
});

// Measurements!
// - engine-1
// - engine-2
// - engine-3
// - altitude
// - speed

// time: 2021-02-05T21:18:29.690Z,
// measurement: speed,
// flight (tag): 1,
// value (field): 2420.76

const relativityBucket = 'from(bucket: "relativity-ramp-up")';

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//get altitude data
app.get("/altitude", async (req, res) => {
  try {
    const fluxQuery =
      relativityBucket +
      "|> range(start: 2021-02-05T21:13:29.690Z, stop: 2021-02-05T21:18:29.690Z)" +
      "|> filter(fn: (r) =>" +
      'r._measurement == "altitude")';
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.json(await queryApi.collectRows(fluxQuery));
  } catch (error) {
    console.log(error);
  }
});

//get engine data
app.get("/engines", async (req, res) => {
  try {
    const fluxQuery =
      relativityBucket +
      "|> range(start: 2021-02-05T21:13:29.690Z, stop: 2021-02-05T21:18:29.690Z)" +
      "|> filter(fn: (r) =>" +
      '(r._measurement == "engine-1" or ' +
      'r._measurement == "engine-2" or ' +
      'r._measurement == "engine-3"))' +
      "|> window(every: 1s)" +
      "|> mean()" +
      '|> duplicate(column: "_start", as: "_time")';

    var dataSet = await queryApi.collectRows(fluxQuery);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.json(dataSet);
  } catch (error) {
    console.log(error);
  }
});

//get acceleration
app.get("/accel", async (req, res) => {
  try {
    const fluxQuery =
      relativityBucket +
      "|> range(start: 2021-02-05T21:13:29.690Z, stop: 2021-02-05T21:18:29.690Z)" +
      "|> filter(fn: (r) =>" +
      'r._measurement == "speed")' +
      "|> derivative(unit: 1s)";

    var dataSet = await queryApi.collectRows(fluxQuery);
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.json(dataSet);
  } catch (error) {
    console.log(error);
  }
});

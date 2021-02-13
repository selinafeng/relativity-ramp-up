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
const port = 3000;

app.get("/", (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/schema", async (req, res) => {
  try {
    const fluxQuery =
      "from(bucket: " +
      '"relativity-ramp-up"' +
      ")" +
      "|> range(start: 2021-02-05T21:13:29.690Z, stop: 2021-02-05T21:18:29.690Z)" +
      "|> filter(fn: (r) =>" +
      'r._measurement == "speed")';
    res.json(await queryApi.collectRows(fluxQuery));
  } catch (error) {
    console.log(error);
  }
});

import express from 'express';
import { InfluxDB } from '@influxdata/influxdb-client'

// These are values that we provide from our InfluxDB instance.
// In the real project, these should go in a .env file!
const token = 'kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA=='
const org = 'codebase-relativity'
const bucket = 'relativity-ramp-up'
const url = 'https://us-west-2-1.aws.cloud2.influxdata.com'

const client = new InfluxDB({ url, token })
const queryApi = client.getQueryApi(org)

export const app = express()
const port = 5000

app.get("/altitude", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const fluxQuery =
    'from(bucket:"' + bucket + '")'
    + '|> range(start: 0)'
    + '|> filter(fn: (r) => r._measurement == "altitude") ';
  const query = res.json(await queryApi.collectRows(fluxQuery));
  res.send(query);
});

app.get("/engines", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const fluxQuery =
    'from(bucket:"' + bucket + '")'
    + '|> range(start: 0)'
    + '|> filter(fn: (r) => r._measurement == "engine-1" or r._measurement == "engine-2" or r._measurement == "engine-3")'
    + '|> window(every: 1s)'
    + '|> mean() ';
  const query = res.json(await queryApi.collectRows(fluxQuery));
  res.send(query);
});

app.get("/acceleration", async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const fluxQuery =
    'from(bucket:"' + bucket + '")'
    + '|> range(start: 0)'
    + '|> filter(fn: (r) => r._measurement == "speed")'
    + '|> derivative(unit: 10ms)';
  const query = res.json(await queryApi.collectRows(fluxQuery));
  res.send(query);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
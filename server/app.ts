import express from 'express';

export const app = express()
const port = 8000;


// server/app.ts

import { InfluxDB } from '@influxdata/influxdb-client'

const token = 'kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA=='
const org = 'codebase-relativity'
const bucket = 'relativity-ramp-up'
const url = 'https://us-west-2-1.aws.cloud2.influxdata.com'

const client = new InfluxDB({ url, token })
const queryApi = client.getQueryApi(org)


app.use((req, res, next) => {
  // allow calling from different domains
  res.set("Access-Control-Allow-Origin", "*");
  // allow authorization header
  res.set("Access-Control-Allow-Headers", "authorization");
  next();
});

app.get('/', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket:"' + bucket + '") |> range(start: -200h) |> map(fn:(r) => ({ r with _time: uint(v: r._time) }))'
    const query = res.json(await queryApi.collectRows(fluxQuery))
    res.send(query)
  } catch (error) {
    console.log(error.stack);
  }
	
})

app.get('/altitude', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket:"' + bucket + '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "altitude") '
    const query = res.json(await queryApi.collectRows(fluxQuery))
    res.send(query)
  } catch (error) {
    console.log(error.stack);
  }
	
})

app.get('/engine', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket:"' + bucket + '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "engine-1" or r._measurement == "engine-2" or r._measurement == "engine-3") |> window(every: 1s) |> mean() '
    const query = res.json(await queryApi.collectRows(fluxQuery))
    res.send(query)
  } catch (error) {
    console.log(error.stack);
  }
	
})

app.get('/speed', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket:"' + bucket + '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "speed")'
    const query = res.json(await queryApi.collectRows(fluxQuery))
    res.send(query)
  } catch (error) {
    console.log(error.stack);
  }
	
})

app.get('/acceleration', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket:"' + bucket + '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "speed") |> difference(nonNegative: false, keepFirst: true)'
    const query = res.json(await queryApi.collectRows(fluxQuery))
    res.send(query)
  } catch (error) {
    console.log(error.stack);
  }
	
})

app.get('/acceleration2', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket:"' + bucket + '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "speed") |> derivative(unit: 1s, nonNegative: true)'
    const query = res.json(await queryApi.collectRows(fluxQuery))
    res.send(query)
  } catch (error) {
    console.log(error.stack);
  }
	
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

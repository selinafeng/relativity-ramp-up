import express from 'express';
import { InfluxDB } from '@influxdata/influxdb-client'
import { isUnionTypeNode } from 'typescript';

const token = 'kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA=='
const org = 'codebase-relativity'
const bucket = 'relativity-ramp-up'
const url = 'https://us-west-2-1.aws.cloud2.influxdata.com'

const client = new InfluxDB({ url, token })
const queryApi = client.getQueryApi(org)

// let startTime = 'duration(v: uint(v: now()) - uint(v: 2021-02-05T21:13:29.690Z))'

export const app = express()
const port = 8000;

// Default 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Endpoint for schema exploration 
app.get('/schema', async (req, res) => {
  console.log('entered');
  const fluxQuery = 'from(bucket: "relativity-ramp-up") |> range(start: -500h)'
  res.json(await queryApi.collectRows(fluxQuery))
})

// Endpoint that gets all data from the altitude measurement 
app.get('/altitude', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const fluxQuery = `from(bucket: "relativity-ramp-up") 
                        |> range(start: -500h)
                        |> filter(fn: (r) => r._measurement == "altitude")`
  res.json(await queryApi.collectRows(fluxQuery))
})

// Endpoint that gets data from all three engines and averages datapoints, grouping by every 1 second 
app.get('/engine', async (req, res) => {
  const fluxQuery = `from(bucket: "relativity-ramp-up") 
                        |> range(start: -500h) 
                        |> filter(fn: (r) => r._measurement == "engine-1" 
                          or r._measurement == "engine-2" 
                          or r._measurement == "engine-3")
                        |> window(every: 1s)
                        |> mean()`
  res.json(await queryApi.collectRows(fluxQuery))
})

// Endpoint that gets acceleration data from the speed measurement 
app.get('/acceleration', async (req, res) => {
  const fluxQuery = `from(bucket: "relativity-ramp-up") 
                        |> range(start: -500h)
                        |> filter(fn: (r) => r._measurement == "speed") 
                        |> derivative(unit: 10ms)`
  res.json(await queryApi.collectRows(fluxQuery))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

import express from 'express';
import { InfluxDB } from '@influxdata/influxdb-client'

const token = 'kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA=='
const org = 'codebase-relativity'
const bucket = 'relativity-ramp-up'
const url = 'https://us-west-2-1.aws.cloud2.influxdata.com'

const client = new InfluxDB({ url, token })
const queryApi = client.getQueryApi(org) 

export const app = express()
const port = 3000

const buildErrorJson = (msg: string) => {
  statusCode: 400
  message: msg
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/get-all-altitude', async (req, res) => {
  const fluxQuery =`
    from(bucket: "relativity-ramp-up")
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "altitude")
  `
  try {
    const rows = await queryApi.collectRows(fluxQuery)
    console.log(rows)
    res.json(rows)
  } catch(e) {
    res.json(buildErrorJson(e))
  }
})

app.get('/aggregate-engines', async (req, res) => {
  console.log("hello")
  const fluxQuery =`
    from(bucket: "relativity-ramp-up")
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "altitude")
  `
  try {
    const rows = await queryApi.collectRows(fluxQuery)
    console.log(rows)
    res.json(rows)
  } catch(e) {
    res.json(buildErrorJson(e))
  }
})

app.get('/get-all-altitude', async (req, res) => {
	const fluxQuery = 'YOUR QUERY HERE'
	res.json(await queryApi.collectRows(fluxQuery))
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

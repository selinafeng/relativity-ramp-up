import express from 'express';

export const app = express()
export const port = 3000

// For testing locally: https://www.npmjs.com/package/cors
var cors = require('cors')
app.use(cors())

import { InfluxDB } from '@influxdata/influxdb-client'

const token = 'kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA=='
const org = 'codebase-relativity'
const bucket = 'relativity-ramp-up'
const url = 'https://us-west-2-1.aws.cloud2.influxdata.com'

const client = new InfluxDB({ url, token })
const queryApi = client.getQueryApi(org)


app.get('/', (req, res) => {
  console.log("hi")
  res.send('Hello World!')
})

app.get('/buckets', async (req, res) => {
  console.log("buckets")
  const fluxQuery = 'buckets()'
  res.json(await queryApi.collectRows(fluxQuery));
})

app.get('/altitude', async (req, res) => {
  console.log("altitude")
  const fluxQuery = 'from(bucket: "relativity-ramp-up") |> range(start: 0) |> filter(fn: (r) => r._measurement == "altitude" )'
  res.json(await queryApi.collectRows(fluxQuery));
})

app.get('/engines', async (req, res) => {
  console.log("engines")
  // https://docs.influxdata.com/influxdb/cloud/query-data/flux/regular-expressions/
  
  // Memory allocation limit reached:
  // const fluxQuery = 'from(bucket: "relativity-ramp-up") |> range(start: 0) |> filter(fn: (r) => r._measurement =~ /engine-[1-3]$/ ) |> aggregateWindow(every: 1s, fn: mean)'

  const fluxQuery = 'from(bucket: "relativity-ramp-up") |> range(start: 0) |> filter(fn: (r) => r._measurement =~ /engine-[1-3]$/ )'
  // res.json(await queryApi.collectRows(fluxQuery))

  console.time("query")
  const data: { [key: string]: string | number }[] = await queryApi.collectRows(fluxQuery)
  console.timeEnd("query")

  console.time("data aggregation")
  const secIndex: number = 17;
  const secLength: number = 2;
  let result: { [key: string]: string | number }[] = []
  let prev: number | null = null;
  let subtotal: number = 0;
  let numEntries: number = 0;
  let entry: { [key: string]: string | number } | null = null;

  // length = 40800 points, takes ~2 min
  for (let i = 0; i < Object.keys(data).length; i += 1) {
    let time = data[i]['_time']
    let curr: number = +time.toString().substring(secIndex, secIndex + secLength)
    if (prev === null || curr != prev) {
      prev = curr
      if (!(entry === null)) {
        entry['stop'] = time
        entry['average'] = subtotal / numEntries
        entry['numEntries'] = numEntries
        subtotal = curr
        numEntries = 1
        result.push(entry)
      }
      entry = {
        'start': time
      }
    } else {
      subtotal += curr
      numEntries += 1
    }
  }
  console.timeEnd("data aggregation")
  res.json(result)
})

app.get('/acceleration', async (req, res) => {
  const fluxQuery = 'from(bucket: "relativity-ramp-up") |> range(start: 0) |> filter(fn: (r) => r._measurement == "speed") |> derivative(unit: 1s)'
  res.json(await queryApi.collectRows(fluxQuery));
})

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

import express from 'express';
import { InfluxDB } from '@influxdata/influxdb-client'

const token = 'kxF9oWgVQdrUMz3kFOwyVw8eRqr1guWFeuSVIdXlBi-8ANuuwH5utNX-bDqh1hbhbmQguXYnPNJCr7AwUONtVA=='
const org = 'codebase-relativity'
const bucket = 'relativity-ramp-up'
const url = 'https://us-west-2-1.aws.cloud2.influxdata.com'

const client = new InfluxDB({ url, token })
const queryApi = client.getQueryApi(org) 

var cors = require('cors') // Can't start React and Express on same server :(

export const app = express()
app.use(cors())
const port = 4000

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
    res.setHeader("Content-Type", "application/json")
    res.json({data: rows, graphTitle: 'All Altitude Data', y: "Altitude", x: "ms"})
  } catch(e) {
    console.log(e)
  }
})

app.get('/aggregate-engines', async (req, res) => {
  const fluxQuery =`
    from(bucket: "relativity-ramp-up")
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "engine-1" or  r._measurement == "engine-2" or  r._measurement == "engine-3")
  `
  try {
    const rows = await queryApi.collectRows(fluxQuery)
    const aggData: object[] = []

    let numStored = 0
    let runningTotal = 0
    let startingTime = 0

    rows.forEach((r: any) => {
      const dateString: string = r["_time"]
      const date = Date.parse(dateString)
      if (startingTime === 0) {
        startingTime = date
      }
      runningTotal += r["_value"]
      numStored += 1
      if (date - startingTime > 1000) { // Date.parse returns milliseconds
        const averageValue = runningTotal / numStored
        const aggregatedRow = Object.assign({}, r, {
          "_value": averageValue,
          "_measurement": "aggregated-engines"
        })
        aggData.push(aggregatedRow)
        runningTotal = 0
        startingTime = 0
        numStored = 0
      }
    })

    res.setHeader("Content-Type", "application/json")
    res.json({data: aggData, label: 'Engines',  graphTitle: 'All Engine Data', y: "Engine", x: "seconds"})
  } catch(e) {
    console.log(e)
  }
})

app.get('/calculate-acceleration', async (req, res) => {
  const fluxQuery =`
    from(bucket: "relativity-ramp-up")
    |> range(start: 0)
    |> filter(fn: (r) => r._measurement == "speed")
  `
  try {
    const rows = await queryApi.collectRows(fluxQuery)
    const accelerationRows = []
    for (let i = 1; i < rows.length; i += 1) {
      const currRow: any = rows[i]
      const prevRow: any = rows[i - 1]
      const deltaV = currRow["_value"] - prevRow["_value"]
      const deltaT = 10 // In milliseconds. Using assumption from Notion.

      accelerationRows.push({
        ...prevRow,
        _value: deltaV / deltaT
      })

    }
    res.setHeader("Content-Type", "application/json")
    res.json({data: accelerationRows, graphTitle: 'Acceleration', y: "dv/dt", x: "ms"})
  } catch(e) {
    console.log(e)
  }
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

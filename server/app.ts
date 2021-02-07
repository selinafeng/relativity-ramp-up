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
    res.json(rows)
  } catch(e) {
    console.log(e)
  }
})

// TODO: FIX ME
app.get('/aggregate-engines', async (req, res) => {
  const fluxQuery =`
    from(bucket: "relativity-ramp-up")
    |> range(start: 0)
    |> aggregateWindow(every: 1s, fn: mean)
  `
  try {
    const rows = await queryApi.collectRows(fluxQuery)
    res.json(rows)
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
    console.log(rows[0])
    const accelerationRows = []
    for (let i = 1; i < rows.length; i += 1) {
      const currRow: any = rows[i]
      const prevRow: any = rows[i - 1]
      const deltaV = currRow["_value"] - prevRow["_value"]
      const deltaT = 10 // In milliseconds. Using assumption from Notion.

      accelerationRows.push({
        time: prevRow["_time"],
        acceleration: deltaV / deltaT
      })

    }
    res.json(accelerationRows)
  } catch(e) {
    console.log(e)
  }
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

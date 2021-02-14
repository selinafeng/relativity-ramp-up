const request = require('supertest')
const { app } = require('./app')

const MOCK_BUCKETS = [{"result":"_result","table":0,"name":"relativity-ramp-up","id":"bd9e6b56d150423b","organizationID":"8c9e72ebc5a89e0d","retentionPolicy":"","retentionPeriod":2592000000000000}]

function randomIntFromInterval(min:number , max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const MOCK_DATA_GENERATOR = (numRows: number) => {
  const measurementChoices = ["engine-1", "engine-2", "engine-3", "altitude", "speed"]
  const out = []

  for (let i = 0; i < numRows; i += 1) {
    const measurementToSelect = measurementChoices[randomIntFromInterval(0, measurementChoices.length - 1)]
    out.push({
      "result":"_result",
      "table":0,
      "_value": randomIntFromInterval(69, 420),
      "_measurement": measurementToSelect
    })
  }

  return out
}

const MOCK_DATA = MOCK_DATA_GENERATOR(1000)

// This tells Jest to replace any imports of `@influxdata/influxdb-client` with our implementation (what's returned from the function)
jest.mock('@influxdata/influxdb-client', () => {
	return {
		// Since we import { InfluxDB } in the app, our mock must provide that class
    InfluxDB: class {
      constructor({ url, token }: { url: string, token: string}) {
        console.log(`InfluxDB client instantiated with ${url}, ${token}`)
      }

			// Since the app calls client.getQueryApi, we must provide a mock implementation
      getQueryApi(org: string) {
        return {
          async collectRows(query: string) {
            console.log(query)
            if (query == 'buckets()') {
							// Here, we hardcode a dummy output, and we test that the app does the correct thing with it later
              return MOCK_BUCKETS
            } else if (query.includes('filter(fn: (r) => r._measurement == "altitude"')) {
              return MOCK_DATA.filter((r) => r["_measurement"] === "altitude")
            }
          }
        }
      }
    }
  }
})

describe('API functionality', () => {
  test('GET /get-all-altitude correctly filters data', async (done) => {
    const res = await request(app).get('/get-all-altitude')
    console.log(Object.keys(res))
    expect(res.status).toBe(200)
    expect(res.body["graphTitle"]).toBe("All Altitude Data")
    expect(res.body["x"]).toBe("ms")
    expect(res.body["y"]).toBe("Altitude")
    done()
  })
})
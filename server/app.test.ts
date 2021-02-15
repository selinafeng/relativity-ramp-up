const request = require('supertest')
const { app } = require('./app')

// Some mock data that we'll use later
const MOCK_ALTITUDE = [{
    "result": "_result",
    "table": 0,
    "_start": "2021-01-24T20:52:29.266395862Z",
    "_stop": "2021-02-14T16:52:29.266395862Z",
    "_time": "2021-02-05T21:14:21.0755644Z",
    "_value": 1.0018900153045887,
    "_field": "value",
    "_measurement": "altitude",
    "_flight": "1",
    "_host": "host1"
}]

const MOCK_ENGINE = [{
    "result": "_result",
    "table": 4,
    "_start": "2021-02-05T21:14:25Z",
    "_stop": "2021-02-05T21:14:26Z",
    "_value": 0.799571536435015,
    "_field": "value",
    "_measurement": "engine-1",
    "_flight": "1",
    "_host": "host1"
}]

const MOCK_ACCELERATION = [{
    "result": "_result",
    "table": 0,
    "_start": "2021-01-25T19:13:13.275096354Z",
    "_stop": "2021-02-15T15:13:13.275096354Z",
    "_time": "2021-02-05T21:14:21.1993111Z",
    "_value": 0.6444810956925451,
    "_field": "value",
    "_measurement": "speed",
    "_flight": "1",
    "_host": "host1"
}]

// This tells Jest to replace any imports of `@influxdata/influxdb-client` with our implementation (what's returned from the function)
jest.mock('@influxdata/influxdb-client', () => {
    return {
        // Since we import { InfluxDB } in the app, our mock must provide that class
        InfluxDB: class {
            constructor({ url, token }: { url: string, token: string }) {
                console.log(`InfluxDB client instantiated with ${url}, ${token}`)
            }

            // Since the app calls client.getQueryApi, we must provide a mock implementation
            getQueryApi(org: string) {
                return {
                    async collectRows(query: string) {
                        if (query == `from(bucket: "relativity-ramp-up") 
                                        |> range(start: -500h)
                                        |> filter(fn: (r) => r._measurement == "altitude")`
                        ) {
                            // Here, we hardcode a dummy output, and we test that the app does the correct thing with it later
                            return MOCK_ALTITUDE
                        }
                        else if (query == `from(bucket: "relativity-ramp-up") 
                                            |> range(start: -500h) 
                                            |> filter(fn: (r) => r._measurement == "engine-1" 
                                                or r._measurement == "engine-2" 
                                                or r._measurement == "engine-3")
                                            |> window(every: 1s)
                                            |> mean()`
                        ) {
                            return MOCK_ENGINE
                        }
                        else if (query == `from(bucket: "relativity-ramp-up") 
                                            |> range(start: -500h)
                                            |> filter(fn: (r) => r._measurement == "speed") 
                                            |> derivative(unit: 10ms)`
                        ) {
                            return MOCK_ACCELERATION
                        }
                    }
                }
            }
        }
    }
})

describe('API functionality', () => {
    test('GET /altitude correctly fetches altitude information', async (done) => {
        await request(app).get('/altitude')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(MOCK_ALTITUDE);

        done()
    })
    test('GET /engine correctly fetches engine information', async (done) => {
        await request(app).get('/engine')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(MOCK_ENGINE);

        done()
    })
    test('GET /acceleration correctly fetches acceleration information', async (done) => {
        await request(app).get('/acceleration')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(MOCK_ACCELERATION);

        done()
    })
})
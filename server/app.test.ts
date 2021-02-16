const request = require('supertest')
const { app } = require('./app')

const MOCK_BUCKETS = [{"result":"_result","table":0,"name":"relativity-ramp-up","id":"bd9e6b56d150423b","organizationID":"8c9e72ebc5a89e0d","retentionPolicy":"","retentionPeriod":2592000000000000}]
const MOCK_ALTITUDE = [
    {
        "result": "_result",
        "table": 0,
        "_start": "1970-01-01T00:00:00Z",
        "_stop": "2021-02-15T21:50:06.277207691Z",
        "_time": "2021-02-05T21:14:21.0460741Z",
        "_value": 0,
        "_field": "value",
        "_measurement": "altitude",
        "flight": "1",
        "host": "host1"
    },
    {
        "result": "_result",
        "table": 0,
        "_start": "1970-01-01T00:00:00Z",
        "_stop": "2021-02-15T21:50:06.277207691Z",
        "_time": "2021-02-05T21:14:21.0600858Z",
        "_value": 0,
        "_field": "value",
        "_measurement": "altitude",
        "flight": "1",
        "host": "host1"
    }
]
const MOCK_ACCELERATION = [
    {
        "result": "_result",
        "table": 0,
        "_start": "1970-01-01T00:00:00Z",
        "_stop": "2021-02-15T21:50:42.511589326Z",
        "_time": "2021-02-05T21:14:21.0600974Z",
        "_value": 71.61114278088935,
        "_field": "value",
        "_measurement": "speed",
        "flight": "1",
        "host": "host1"
    },
    {
        "result": "_result",
        "table": 0,
        "_start": "1970-01-01T00:00:00Z",
        "_stop": "2021-02-15T21:50:42.511589326Z",
        "_time": "2021-02-05T21:14:21.0755785Z",
        "_value": 64.16430682240996,
        "_field": "value",
        "_measurement": "speed",
        "flight": "1",
        "host": "host1"
    }
]

jest.mock('@influxdata/influxdb-client', () => {
    return {
        InfluxDB: class {
            constructor({ url, token }: { url: string, token: string}) {
                console.log(`InfluxDB client instantiated with ${url}. ${token}`)
            }

            getQueryApi(org: string) {
                return {
                    async collectRows(query: string) {
                        if (query == 'buckets()') {
                            return MOCK_BUCKETS
                        }
                        if (query == 'from(bucket: "relativity-ramp-up") |> range(start: 0) |> filter(fn: (r) => r._measurement == "altitude" )') {
                            return MOCK_ALTITUDE
                        }
                        if (query == 'from(bucket: "relativity-ramp-up") |> range(start: 0) |> filter(fn: (r) => r._measurement == "speed") |> derivative(unit: 1s)') {
                            return MOCK_ACCELERATION
                        } else {
                            return "Unexpected query"
                        }
                    }
                }
            }
        }
    }
})

describe('API functionality', () => {
    test('GET /buckets correctly fetches buckets', async (done) => {
        await request(app).get('/buckets')
            .expect(200)
            .expect('Content-type', /json/)
            .expect(MOCK_BUCKETS)
        
        done()
    })

    test('GET /altitude correctly fetches altitude data', async (done) => {
        await request(app).get('/altitude')
            .expect(200)
            .expect('Content-type', /json/)
            .expect(MOCK_ALTITUDE)
        
        done()
    })

    test('GET /acceleration correctly fetches acceleration data', async (done) => {
        await request(app).get('/acceleration')
            .expect(200)
            .expect('Content-type', /json/)
            .expect(MOCK_ACCELERATION)
        
        done()
    })
})



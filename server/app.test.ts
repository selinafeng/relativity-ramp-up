
const request = require('supertest')
const { app } = require('./app')

const MOCK_BUCKETS = [{"result":"_result","table":0,"name":"relativity-ramp-up","id":"bd9e6b56d150423b","organizationID":"8c9e72ebc5a89e0d","retentionPolicy":"","retentionPeriod":2592000000000000}]

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
})

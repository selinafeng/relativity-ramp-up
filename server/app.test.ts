// server/app.test.ts

const request = require("supertest");
const { app } = require("./app");

// Some mock data that we'll use later
const MOCK_BUCKETS = [
  {
    result: "_result",
    table: 0,
    name: "relativity-ramp-up",
    id: "bd9e6b56d150423b",
    organizationID: "8c9e72ebc5a89e0d",
    retentionPolicy: "",
    retentionPeriod: 2592000000000000,
  },
];

const MOCK_ACCEL = [
  {
    result: "_result",
    table: 0,
    _start: "2021-02-05T21:13:29.69Z",
    _stop: "2021-02-05T21:18:29.69Z",
    _time: "2021-02-05T21:14:21.0600974Z",
    _value: 71.61114278088935,
    _field: "value",
    _measurement: "speed",
    flight: "1",
    host: "host1",
  },
  {
    result: "_result",
    table: 0,
    _start: "2021-02-05T21:13:29.69Z",
    _stop: "2021-02-05T21:18:29.69Z",
    _time: "2021-02-05T21:14:21.0600974Z",
    _value: 4,
    _field: "value",
    _measurement: "speed",
    flight: "1",
    host: "host1",
  },

  
  ]
];

// This tells Jest to replace any imports of `@influxdata/influxdb-client` with our implementation (what's returned from the function)
jest.mock("@influxdata/influxdb-client", () => {
  return {
    // Since we import { InfluxDB } in the app, our mock must provide that class
    InfluxDB: class {
      constructor({ url, token }: { url: string; token: string }) {
        console.log(`InfluxDB client instantiated with ${url}, ${token}`);
      }

      // Since the app calls client.getQueryApi, we must provide a mock implementation
      getQueryApi(org: string) {
        return {
          async collectRows(query: string) {
            if (query == "buckets()") {
              // Here, we hardcode a dummy output, and we test that the app does the correct thing with it later
              return MOCK_BUCKETS;
            }
            if (query == 'from(bucket: "relativity-ramp-up")'   + 
             "|> range(start: 2021-02-05T21:13:29.690Z, stop: 2021-02-05T21:18:29.690Z)" +
            "|> filter(fn: (r) =>" +
            'r._measurement == "speed")' +
            "|> derivative(unit: 1s)") {
              return MOCK_ACCEL;
            }
          },
        };
      }
    },
  };
});

describe("API functionality", () => {
  test("GET /buckets correctly fetches buckets", async (done) => {
    await request(app)
      .get("/buckets")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(MOCK_BUCKETS);

    done();
  });

  test("GET /buckets correctly fetches buckets", async (done) => {
    await request(app)
      .get('/from(bucket: "relativity-ramp-up")'   + 
      "|> range(start: 2021-02-05T21:13:29.690Z, stop: 2021-02-05T21:18:29.690Z)" +
     "|> filter(fn: (r) =>" +
     'r._measurement == "speed")' +
     "|> derivative(unit: 1s)")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(MOCK_ACCEL);

    done();
  });
});

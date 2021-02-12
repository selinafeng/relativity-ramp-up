const request = require("supertest");
const { app } = require("./app");

const bucket = "relativity-ramp-up";

jest.mock("@influxdata/influxdb-client", () => {
  return {
    InfluxDB: class {
      constructor({ url, token }: { url: string; token: string }) {
        console.log(`InfluxDB client instantiated with ${url}, ${token}`);
      }

      getQueryApi(org: string) {
        return {
          async collectRows(query: string) {
            if (
              query ==
              'from(bucket:"' +
                bucket +
                '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "speed")'
            ) {
              return MOCK_SPEED;
            }
            if (
              query ==
              'from(bucket:"' +
                bucket +
                '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "altitude") '
            ) {
              return MOCK_ALT;
            }
            if (
              query ==
              'from(bucket:"' +
                bucket +
                '") |> range(start: 0)  |> filter(fn: (r) => r._measurement == "speed") |> difference(nonNegative: false, keepFirst: true)'
            ) {
              return MOCK_ACC;
            }
          },
        };
      }
    },
  };
});

const MOCK_SPEED = [
  {
    result: "_result",
    table: 0,
    _start: "1970-01-01T00:00:00Z",
    _stop: "2021-02-12T11:30:24.445297432Z",
    _time: "2021-02-05T21:14:21.0461067Z",
    _value: 0,
    _field: "value",
    _measurement: "speed",
    flight: "1",
    host: "host1",
  },
];

const MOCK_ALT = [
  {
    result: "_result",
    table: 0,
    _start: "1970-01-01T00:00:00Z",
    _stop: "2021-02-12T22:00:49.737656103Z",
    _time: "2021-02-05T21:14:21.0460741Z",
    _value: 0,
    _field: "value",
    _measurement: "altitude",
    flight: "1",
    host: "host1",
  },
];

const MOCK_ACC = [
  {
    result: "_result",
    table: 0,
    _start: "1970-01-01T00:00:00Z",
    _stop: "2021-02-12T22:02:24.838859679Z",
    _time: "2021-02-05T21:14:21.0461067Z",
    _value: null,
    _field: "value",
    _measurement: "speed",
    flight: "1",
    host: "host1",
  },
];

describe("API functionality", () => {
  test("GET /speed correctly fetches speed", async (done) => {
    await request(app)
      .get("/speed")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(MOCK_SPEED);

    done();
  });

  test("GET /acceleration correctly fetches acceleration", async (done) => {
    await request(app)
      .get("/acceleration")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(MOCK_ACC);

    done();
  });

  test("GET /altitude correctly fetches altitude", async (done) => {
    await request(app)
      .get("/altitude")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(MOCK_ALT);

    done();
  });
});

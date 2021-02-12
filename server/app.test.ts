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

describe("API functionality", () => {
  test("GET /speed correctly fetches speed", async (done) => {
    await request(app)
      .get("/speed")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect(MOCK_SPEED);

    done();
  });
});

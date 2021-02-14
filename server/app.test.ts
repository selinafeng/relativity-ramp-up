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
});

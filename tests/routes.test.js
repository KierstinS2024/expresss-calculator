const request = require("supertest");
const app = require("../app");

describe("Routes", () => {
    test("/mean returns correct mean", async () => {
        const res = await request(app)
            .get("/mean?nums=1,3,5")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(200);
        expect(res.body.value).toBe(3);
    });

    test("/median returns correct median", async () => {
        const res = await request(app)
            .get("/median?nums=1,3,5")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(200);
        expect(res.body.value).toBe(3);
    });

    // Corrected test for single mode - now expects an array in the value field
    test("/mode returns correct mode", async () => {
        const res = await request(app)
            .get("/mode?nums=1,1,2,3")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(200);
        expect(res.body.value).toEqual([1]);
    });

    test("/mean with invalid num returns 400", async () => {
        const res = await request(app)
            .get("/mean?nums=1,foo,3")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(400);
        expect(res.body.error.message).toMatch(/is not a number/);
    });

    test("/mean with missing nums returns 400", async () => {
        const res = await request(app)
            .get("/mean")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(400);
        expect(res.body.error.message).toMatch(/nums are required/);
    });

    // Corrected test for all routes
    test("/all returns all operations", async () => {
        const res = await request(app)
            .get("/all?nums=1,2,3")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(200);
        expect(res.body.mean).toBe(2);
        expect(res.body.median).toBe(2);
        expect(res.body.mode).toEqual([]);
    });

    test("/all returns all operations with multiple modes", async () => {
        const res = await request(app)
            .get("/all?nums=1,1,2,2,3")
            .set('Accept', 'application/json'); // Tell the server to send JSON
        expect(res.statusCode).toBe(200);
        expect(res.body.mean).toBe(1.8);
        expect(res.body.median).toBe(2);
        expect(res.body.mode).toEqual([1, 2]);
    });
});

import request from "supertest";
import app from "../../server/server";
import User from "../../server/models/User.js";

describe("User model", () => {
    test("It should create a new user", async () => {
        const userData = { firebaseUid: "test" };
        const response = await request(app).post("/users").send(userData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('._id');
        expect(response.body.firebaseUid).toBe('test');

        const verify = await User.findOne({ firebaseUid: userData.firebaseUid });
        expect(verify).not.toBeNull();
    })
})
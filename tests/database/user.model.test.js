import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../server/server";
import User from "../../server/models/User";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("User model", () => {
    test("It should create a new user", async () => {
        const userData = { firebaseUid: "test", dailyLogs: [], recipes: [] };
        const response = await request(app).post("/users").send(userData);
    })
})
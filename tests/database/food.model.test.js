import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../../server/server";
import Food from "../../server/models/Food.js";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    await Food.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Food model", () => {
    test("It should create a new food", async () => {
        const foodData = {
            name: "Banana",
            calories: 120,
            fat: 1,
            carbohydrates: 9,
            protein: 0
        }
        const response = await request(app).post("/")
    })
})
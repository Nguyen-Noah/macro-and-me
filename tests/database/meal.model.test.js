import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../server/server";
import Meal from "../../server/models/Meal";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterEach(async () => {
    await Meal.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Meal model", () => {

})
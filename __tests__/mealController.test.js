import { jest } from '@jest/globals';
/* jest.mock('mongoose', () => ({
    ...jest.requireActual('mongoose'),
    model: jest.fn(() => ({
      findOne: jest.fn(),
      save: jest.fn(),
    })),
})); */

jest.unstable_mockModule("../server/models/User.js", () => ({
    default: {
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../server/models/Log.js", () => ({
    default: {
        findOne: jest.fn(),
    },
}));

jest.unstable_mockModule("../server/services/foodFactory.js", () => ({
    createFood: jest.fn(),
}));

jest.unstable_mockModule("../server/services/logFactory.js", () => ({
    findOrCreateLog: jest.fn(),
}));

jest.unstable_mockModule("../server/services/mealFactory.js", () => ({
    findOrCreateMeal: jest.fn(),
}));

const { createMeal, getMealByType } = await import("../server/controllers/mealController.js");
const User = (await import("../server/models/User.js")).default;
const Log = (await import("../server/models/Log.js")).default;
const { createFood } = await import("../server/services/foodFactory.js");
const { findOrCreateLog } = await import("../server/services/logFactory.js");
const { findOrCreateMeal } = await import("../server/services/mealFactory.js");

describe("Meal Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createMeal", () => {
        it("should create a meal and update user's daily log", async () => {
            const req = {
                body: {
                    firebaseUid: "testUid",
                    mealType: "breakfast",
                    name: "Oatmeal",
                    calories: 150,
                    fat: 3,
                    carbohydrates: 27,
                    protein: 5,
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockUser = { _id: "userId", daily_logs: [], save: jest.fn() };
            const mockLog = { _id: "logId", breakfast: null, save: jest.fn() };
            const mockFood = { _id: "foodId", name: "Oatmeal" };
            const mockMeal = { _id: "mealId" };

            User.findOne.mockResolvedValue(mockUser);
            findOrCreateLog.mockResolvedValue(mockLog);
            createFood.mockResolvedValue(mockFood);
            findOrCreateMeal.mockResolvedValue(mockMeal);

            await createMeal(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ firebaseUid: "testUid" });
            expect(findOrCreateLog).toHaveBeenCalledWith("userId");
            expect(createFood).toHaveBeenCalledWith({
                name: "Oatmeal",
                calories: 150,
                fat: 3,
                carbohydrates: 27,
                protein: 5,
            });
            expect(findOrCreateMeal).toHaveBeenCalledWith("userId", "breakfast", "foodId");
            expect(mockLog.save).toHaveBeenCalled();
            expect(mockUser.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Meal logged successfully!",
                food: mockFood,
            });
        });

        it("should return 404 if user is not found", async () => {
            const req = {
                body: { firebaseUid: "testUid" },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValue(null);

            await createMeal(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    describe("getMealByType", () => {
        it("should return a meal by type for the given date", async () => {
            const req = {
                body: {
                    firebaseUid: "testUid",
                    mealType: "breakfast",
                    date: "2024-12-04",
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            const mockUser = { _id: "userId" };
            const mockLog = { breakfast: "mealId" };

            User.findOne.mockResolvedValue(mockUser);
            Log.findOne.mockResolvedValue(mockLog);

            await getMealByType(req, res);

            const date = new Date("2024-12-04");
            date.setHours(0, 0, 0, 0);

            expect(User.findOne).toHaveBeenCalledWith({ firebaseUid: "testUid" });
            expect(Log.findOne).toHaveBeenCalledWith({
                userId: "userId",
                date: date,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ mealId: "mealId" });
        });

        it("should return 404 if user is not found", async () => {
            const req = {
                body: { firebaseUid: "testUid" },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            User.findOne.mockResolvedValue(null);

            await getMealByType(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
});

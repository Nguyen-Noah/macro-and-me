import Food from "../../server/models/Food.js";

describe("createOrFindFood", () => {
    it("should create a new food item if it does not exist", async() => {
        const foodData = {
            name: "Apple",
            calories: 95,
            fat: 0,
            carbohydrates: 25,
            protein: 0
        };

        const food = await createOrFindFood({ ...foodData });
        
        const foundFood = await Food.findOne({ name: "Apple" });
        expect(foundFood).toBeDefined();
        expect(foundFood.calories).toBe(95);
    })

    it("should return an existing food item if it already exists", async() => {
        const foodData = {
            name: "Banana",
            calories: 105,
            fat: 0,
            carbohydrates: 27,
            protein: 1
        };

        const existingFood = new Food(foodData);
        await existingFood.save();

        const foundFood = await createOrFindFood(foodData.name, foodData.calories, foodData.fat, foodData.carbohydrates, foodData.protein);

        expect(foundFood._id.toString()).toBe(existingFood._id.toString());
        expect(foundFood.calories).toBe(105);
    })
})
import Food from "../models/Food.js";

export const createFood = async ({ name, calories, fat, carbohydrates, protein }) => {
    try {
        const food = new Food({ name, calories, fat, carbohydrates, protein });
        await food.save();
        console.log("New food created:", food);
        return food;
    } catch (error) {
        console.error("Error creating food:", error);
        throw new Error("Unable to create food");
    }
};

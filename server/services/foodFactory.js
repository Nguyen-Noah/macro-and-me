import Food from "../models/Food.js";

export const findOrCreateFood = async ({ name, calories, fat, carbohydrates, protein }) => {
    try {
        let food = await Food.findOne({ name, calories, fat, carbohydrates, protein });

        if (!food) {
            food = new Food({ name, calories, fat, carbohydrates, protein });
            await food.save();
            console.log('New food created:', food);
        } else {
            console.log('Existing food found:', food);
        }

        return food;
    } catch (error) {
        console.error('Error in findOrCreateFood', error);
    }
};
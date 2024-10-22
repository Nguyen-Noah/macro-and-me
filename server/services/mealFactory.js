import Log from "../models/Log.js";
import Meal from "../models/Meal.js";

export const findOrCreateMeal = async (mealType, newFoodId) => {
    try {
        const query = {}
        query[mealType] = { $ne: null };

        const result = await Log.findOne(query).populate(mealType);

        let meal;
        if (result) {
            console.log(`Found log with ${mealType}`, result[mealType]);
            meal = result[mealType];
            meal.obj.push(newFoodId);
        } else {
            meal = new Meal({ obj: [newFoodId] });
            console.log('No meal found');
        }
        await meal.save();

        return meal;
    } catch (error) {
        console.error('Error in the findOrCreateMeal', error);
    }
}
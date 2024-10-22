import Meal from "../models/Meal.js";

export const findOrCreateMeal = async (mealId, newFoodId) => {
    try {

        let meal;
        if (mealId) {
            meal = await Meal.findById(mealId);
            if (!meal) {
                throw new Error('Meal not found');
            }

            meal.obj.push(newFoodId);
            await meal.save();
        } else {
            meal = new Meal({ obj: [newFoodId] });
            await meal.save();
        }

        return meal;
    } catch (error) {
        console.error('Error in findOrCreateMeal:', error);
    }
};
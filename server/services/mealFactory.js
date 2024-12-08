import Log from "../models/Log.js";
import Meal from "../models/Meal.js";

export const findOrCreateMeal = async (userId, mealType, newFoodId) => {
    try {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setHours(date.getHours() - 5);

        const query = {
            userId: userId,
            [mealType]: { $ne: null },
            date: date
        }

        const result = await Log.findOne(query).populate(mealType);

        let meal;
        if (result) {
            console.log(`Found log with ${mealType} on ${date}`, result[mealType]);
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
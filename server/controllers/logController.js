import Food from "../models/Food.js";
import Log from "../models/Log.js";
import Meal from "../models/Meal.js";
import User from "../models/User.js";

// fetching and processing foods for a single meal
const processMeal = async (mealName, mealId) => {
    const meal = await Meal.findById(mealId);
    const foods = await fetchFoodsForMeals([meal]);

    const totalNutrition = foods.flat().reduce(
        (totals, food) => {
            totals.calories += food.calories || 0;
            totals.fat += food.fat || 0;
            totals.protein += food.protein || 0;
            totals.carbs += food.carbs || 0;
            return totals;
        },
        { calories: 0, fat: 0, protein: 0, carbs: 0 }
    );

    return {
        [mealName]: {
            foods: foods.flat(),
            totalNutrition
        }
    };
};

// fetching and processing meals
const processDayMeals = async (mealIds) => {
    const meals = await Promise.all(
        Object.entries(mealIds)
            .filter(([_, mealId]) => mealId) // dont include null or unidentified
            .map(([mealName, mealId]) => processMeal(mealName, mealId))
    );

    // combining meals into single obj
    return meals.reduce((acc, meal) => ({ ...acc, ...meal }), {});
};

const calculateDailyTotal = (dayMeals) => {
    return Object.values(dayMeals).reduce(
        (totals, meal) => {
            totals.calories += meal.totalNutrition.calories;
            totals.fat += meal.totalNutrition.fat;
            totals.protein += meal.totalNutrition.protein;
            totals.carbs += meal.totalNutrition.carbs;
            return totals;
        },
        { calories: 0, fat: 0, protein: 0, carbs: 0 }
    );
};

// main function
const getLogs = async (userId) => {
    try {
        const logs = await Log.find({ userId }).sort({ date: -1 });

        const results = await Promise.all(
            logs.map(async (log) => {
                const mealIds = {
                    breakfast: log.breakfast,
                    lunch: log.lunch,
                    dinner: log.dinner,
                    snacks: log.snacks
                };

                const dayMeals = await processDayMeals(mealIds);
                const dailyTotal = calculateDailyTotal(dayMeals);

                return {
                    date: log.date,
                    dailyTotal,
                    ...dayMeals
                };
            })
        );

        return results;
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
};

const fetchFoodsForMeals = async (meals) => {
    return await Promise.all(
        meals.map(async (meal) => {
            const foodIds = meal.obj || [];
            const foods = await Food.find({ _id: { $in: foodIds } }).select('name calories fat protein carbohydrates');
            return foods;
        })
    );
}

export const getUserDailyLogs = async (req, res) => {
    try {
        const mongoId = await User.findOne({ firebaseUid: req.query.firebaseUid });
        const dailyLogs = await getLogs(mongoId);

        res.status(200).json(dailyLogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
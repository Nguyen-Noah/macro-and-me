import Log from "../models/Log.js";
import Meal from "../models/Meal.js";
import User from "../models/User.js";
import { findOrCreateFood } from "../services/foodFactory.js";
import { findOrCreateLog } from "../services/logFactory.js";
import { findOrCreateMeal } from "../services/mealFactory.js";

export const createMeal = async (req, res) => {
    const { firebaseUid, mealType, name, calories, fat, carbohydrates, protein } = req.body;

    try {
        // check for the user
        const user = await User.findOne({ firebaseUid: firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const dailyLog = await findOrCreateLog(user._id);
        const newFood = await findOrCreateFood({ name, calories, fat, carbohydrates, protein });
        const meal = await findOrCreateMeal(user._id, mealType, newFood._id);

        // set the selected meal in the log to this one then save
        dailyLog[mealType] = meal._id;
        await dailyLog.save();

        // check if the log is in the user's daily_logs and if its not then add it
        if (!user.daily_logs.includes(dailyLog._id)) {
            user.daily_logs.push(dailyLog._id);
            await user.save();
        }

        res.status(201).json({ message: 'Meal logged successfully!', food: newFood });
    } catch (error) {
        console.error('Error adding meal:', error);
        res.status(500).json({ message: 'Error adding meal'});
    }
};

export const getMealByType = async (req, res) => {
    const { firebaseUid, mealType, date } = req.body;

    try {
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let logDate;
        if (date) {
            logDate = new Date(date);
        } else {
            logDate = new Date();
        }
        logDate.setHours(0, 0, 0, 0);
        const dailyLog = await Log.findOne({ userId: user._id, date: logDate });

        if (!dailyLog || !dailyLog[mealType]) {
            return res(404).json({ message: 'Meal not found' });
        }

        res.status(200).json({ mealId: dailyLog[mealType] });
    } catch (error) {
        console.log('Error fetching meal:', error);
        res.status(500).json({ message: 'Internal server error'});
    }
};


/*
USAGE: make sure to use api.delete() for this call (reference the route in mealRoutes.js)
       also ensure that all of the variable names that are passed in match what are expected, namely:
       fireaseUid, mealType, foodId.
       example payload
        {
            "firebaseUid": "PecTgywMSke8eZjaHvLvk4colCz1",
            "mealType": "breakfast",
            "foodId": "6751f84d9a2a8d48cbdb70fb"
        }
       the foodIds are all provided in the logs that are sent to the frontend
*/
export const removeFood = async (req, res) => {
    const { firebaseUid, mealType, foodId } = req.body;

    try {
        const user = await User.findOne({ firebaseUid: firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recentLog = await Log.findOne({ userId: user._id })
                                    .sort({ createdAt: -1 })
                                    .exec();

        const target = recentLog[mealType];
        const updatedMeal = await Meal.findByIdAndUpdate(
            target,
            { $pull: { obj: foodId } },
            { new: true }
        );

        if (!updatedMeal) {
            return res.stats(404).json({ error: 'Meal not found.' });
        }

        res.status(200).json(updatedMeal);
    } catch (error) {
        console.error('Error removing food:', error);
        res.status(500).json({ message: 'Error removing food'});
    }
}
import Log from "../models/Log.js";
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
        const meal = await findOrCreateMeal(mealType, newFood._id);

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
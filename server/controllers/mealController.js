import Log from "../models/Log.js";
import Meal from "../models/Meal.js";
import User from "../models/User.js";
import Food from '../models/Food.js';
import { createFood } from "../services/foodFactory.js";
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
        const newFood = await createFood({ name, calories, fat, carbohydrates, protein });
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
        res.status(500).json({ message: 'Error adding meal' });
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
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const removeFood = async (req, res) => {
    const { firebaseUid, mealType, foodId, date } = req.body;

    try {
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Query all logs for the user and loop through them
        const logs = await Log.find({ userId: user._id });

        if (!logs || logs.length === 0) {
            return res.status(404).json({ message: "No logs found for the user" });
        }

        // Find the log for the specific date
        let selectedLog = null;
        for (let log of logs) {
            const logDate = new Date(log.date);
            const selectedDate = new Date(date);
            logDate.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            if (logDate.getTime() === selectedDate.getTime()) {
                selectedLog = log;
                break;
            }
        }

        if (!selectedLog) {
            return res.status(404).json({ message: "Log not found for the selected date" });
        }

        // Ensure mealType is correct, and pull the foodId from that meal
        const meal = selectedLog[mealType];
        if (!meal) {
            return res.status(404).json({ message: `${mealType} not found for the selected date` });
        }

        // Perform the deletion from the meal
        const updatedMeal = await Meal.findByIdAndUpdate(
            meal,
            { $pull: { obj: foodId } },
            { new: true }
        );

        if (!updatedMeal) {
            return res.status(404).json({ message: "Meal not found." });
        }

        // Remove the food entry from the Food collection
        const deletedFood = await Food.findByIdAndDelete(foodId);
        if (!deletedFood) {
            return res.status(404).json({ message: "Food not found in the Food collection" });
        }

        // Check if the meal is now empty, and delete if so
        if (updatedMeal.obj.length === 0) {
            await Meal.findByIdAndDelete(meal);

            // Remove the reference to the deleted meal from the log
            selectedLog[mealType] = null;
            await selectedLog.save();
        }

        // Check if the log has any remaining meals, and delete if empty
        const remainingMeals = ["breakfast", "lunch", "dinner", "snacks"].some(
            (mealType) => selectedLog[mealType] !== null
        );

        if (!remainingMeals) {
            await Log.findByIdAndDelete(selectedLog._id);

            // Remove the reference to the deleted log from the user
            user.daily_logs = user.daily_logs.filter(
                (logId) => logId.toString() !== selectedLog._id.toString()
            );
            await user.save();
        }

        res.status(200).json({
            message: "Food, meal, and log cleaned up successfully if necessary",
            deletedFood,
            updatedMeal,
        });
    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ message: "Error removing food" });
    }
};

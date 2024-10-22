import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    obj: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
}, { timestamps: true });

const Meal = mongoose.model('Meal', mealSchema);

export default Meal;
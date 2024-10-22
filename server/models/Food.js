import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    calories: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    carbohydrates: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema);

export default Food;
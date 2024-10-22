import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    breakfast: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
    lunch: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
    dinner: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
    snacks: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
}, { timestamps: true });
  
const Log = mongoose.model('Log', logSchema);

export default Log;
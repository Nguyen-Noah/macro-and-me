import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    obj: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
    name: { type: String, required: true },
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
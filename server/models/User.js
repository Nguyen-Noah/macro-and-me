import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: {type: String, required: true, unique: true},
    daily_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
}, { timestamps: true });

const User  = mongoose.model('User', userSchema);

export default User;
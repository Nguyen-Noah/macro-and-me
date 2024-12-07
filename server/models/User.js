import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: { type: String, required: true, unique: true },
        displayName: { type: String },
        email: { type: String },
        userData: {
            height: { type: Number, required: true }, 
            weight: { type: Number, required: true }, 
            age: { type: Number, required: true },
            activityLevel: { 
                type: String, 
                enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'],
                default: 'moderately_active',
            },
            maxCal: { type: Number },
            maxProtein: { type: Number },
            maxCarb: { type: Number },
            maxFat: { type: Number },
            goal: {
                type: String,
                enum: ['maintain', 'cut', 'bulk'],
                default: 'maintain', // Default to maintain if no goal is specified
            },
        },
        
        daily_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
        recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;

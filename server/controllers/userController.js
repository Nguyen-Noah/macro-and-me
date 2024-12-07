import User from "../models/User.js";

export const fetchUser = async (firebaseUid) => {
    try {
        return await User.findOne({ firebaseUid });
    } catch (error) {
        console.error("Error fetching user from MongoDB:", error);
        throw new Error("Failed to fetch user");
    }
};


export const createUser = async (req, res) => {
    const { firebaseUid, displayName } = req.body;

    try {
        let user = await fetchUser(firebaseUid);

        if (!user) {
            user = new User({ firebaseUid, displayName });
        } else if (displayName && user.displayName !== displayName) {
            user.displayName = displayName;
        }
        await user.save();

        console.log('user saved');
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error saving user to MongoDB' });
    }
};


export const updateUserProfile = async (req, res) => {
    const { firebaseUid, userData } = req.body;

    try {
        // Extract user details and goal for macro calculations
        const { height, weight, age, activityLevel, goal } = userData;
        const activityLevels = {
            sedentary: 1.2,
            lightly_active: 1.375,
            moderately_active: 1.55,
            very_active: 1.725,
            extra_active: 1.9,
        };

        // Calculate TDEE
        const bmr = 10 * weight + 6.25 * height - 5 * age;
        const tdee = Math.round(bmr * (activityLevels[activityLevel] || 1.55));

        // Calculate calorie goal based on the selected goal
        let calorieGoal = tdee;
        if (goal === "cut") {
            calorieGoal = Math.round(tdee - tdee * 0.2); // 20% deficit
        } else if (goal === "bulk") {
            calorieGoal = Math.round(tdee + tdee * 0.2); // 20% surplus
        }

        // Calculate macros
        const maxProtein = Math.round((calorieGoal * 0.3) / 4); // 30% of calories
        const maxCarb = Math.round((calorieGoal * 0.4) / 4); // 40% of calories
        const maxFat = Math.round((calorieGoal * 0.3) / 9); // 30% of calories

        // Update userData with calculated macros and goal
        const updatedUserData = {
            ...userData,
            maxCal: calorieGoal,
            maxProtein,
            maxCarb,
            maxFat,
        };

        // Update the user in the database
        const user = await User.findOneAndUpdate(
            { firebaseUid },
            { $set: { userData: updatedUserData } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user" });
    }
};




export const getUserProfile = async (req, res) => {
    const { firebaseUid } = req.query;

    try {
        // Fetch the user by Firebase UID
        const user = await User.findOne({ firebaseUid });
        console.log("User fetched from DB:", user);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract userData and log the goal for debugging
        const userData = user.userData || {};
        console.log("UserData extracted:", userData);
        console.log("Goal extracted:", userData.goal);

        // Respond with user profile including goal
        res.status(200).json({
            displayName: user.displayName,
            email: user.email,
            ...userData, // Includes height, weight, age, activityLevel, goal, and macros
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Server error while fetching user profile" });
    }
};

import User from "../models/User.js";

export const createUser = async (req, res) => {
    const { firebaseUid } = req.body;

    try {
        let user = await User.findOne({ firebaseUid });

        if (!user) {
            user = new User({ firebaseUid });
            await user.save();
        }

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error saving user to MongoDB' });
    }
};
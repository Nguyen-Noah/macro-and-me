import User from "../models/User.js";

export const createUser = async (req, res) => {
    const { uid } = req.body;

    try {
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = new User({ firebaseUid: uid });
            await user.save();
        }

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error saving user to MongoDB' });
    }
};
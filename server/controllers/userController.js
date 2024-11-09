import User from "../models/User.js";

export const createUser = async (req, res) => {
    const { firebaseUid, displayName } = req.body;

    try {
        let user = await User.findOne({ firebaseUid });
        console.log(displayName)

        if (!user) {
            user = new User({ firebaseUid, displayName });
        } else if (displayName && user.displayName !== displayName) {
            user.displayName = displayName;
        }
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error saving user to MongoDB' });
    }
};
import User from "../models/User.js";

const fetchUser = async (firebaseUid) => {
    return await User.findOne({ firebaseUid });
};

const createUser = async (req, res) => {
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

export { fetchUser, createUser };
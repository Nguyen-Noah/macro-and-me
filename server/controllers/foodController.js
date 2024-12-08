import Food from "../models/Food.js";

export const editFood = async (req, res) => {
    const { foodId, updatedFood } = req.body;

    console.log(foodId)

    try {
        const food = await Food.findByIdAndUpdate(
            foodId,
            { $set: updatedFood },
            { new: true }
        ).lean();

        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }

        res.status(200).json({ message: 'Food updated sucessfully', data: food });
    } catch (error) {
        console.error('Error updating food:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
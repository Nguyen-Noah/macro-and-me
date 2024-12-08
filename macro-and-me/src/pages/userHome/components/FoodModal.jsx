const FoodModal = ({ food, onSave, onCancel, onMacroChange, errorMessage }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96">
                <h1 className="text-lg font-semibold mb-4 text-black">{food.name}</h1>
                {["calories", "protein", "carbohydrates", "fat"].map((macro) => (
                    <div key={macro} className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-black">
                            {macro.charAt(0).toUpperCase() + macro.slice(1)}
                        </label>
                        <input
                            type="number"
                            className="bg-gray-100 border rounded-md w-full px-2 py-1 text-black"
                            value={food[macro] || 0}
                            onChange={(e) => onMacroChange(macro, parseFloat(e.target.value) || 0)}
                        />
                    </div>
                ))}
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">Sorry Bucko, Not Implemented</div>
                )}
                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={onSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodModal;

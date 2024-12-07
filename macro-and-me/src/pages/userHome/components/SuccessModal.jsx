export const SuccessModal = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-lg shadow-md z-50">
            <p className="font-semibold">Meal logged successfully!</p>
        </div>
    );
};


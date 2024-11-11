
const MealSection = () => {

    return (
        <section className="px-6 py-10">
            <div className="w-full mt-8 space-y-4">
                {['Water', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, index) => (
                    <div key={index} className="bg-neutral-800 p-4 rounded-lg h-20 flex items-center">
                        {meal}
                    </div>
                ))}
            </div>
        </section>

    );
};

export default MealSection;

const MealSection = () => {

    return (
        <section className="px-6 py-2">
            <div className="w-full mt-8 space-y-4">
                {['Snacks', 'Breakfast', 'Lunch', 'Dinner'].map((meal, index) => (
                    <div key={index} className="bg-neutral-900 p-4 rounded-lg h-20 flex items-center">
                        {meal}
                    </div>
                ))}
            </div>
        </section>

    );
};

export default MealSection;
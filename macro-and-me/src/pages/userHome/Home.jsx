import MealSection from "./components/MealSection";
import NavBar from "./components/NavBar";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../../firebaseConfig";
import { useRefresh } from "./context/RefreshContext";
import MacroDataSection from "./components/MacroDataSection";
import { useState } from "react";
import DatePicker from "./components/DatePicker"


export default function Home() {

    

    const { refreshKey, triggerRefresh } = useRefresh();
    const [selectedDate, setSelectedDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    });



    // const handleLogout = () => {
    //     auth.signOut()
    //         .then(() => {
    //             console.log("User signed out.");
    //             navigate("/login");
    //         })
    //         .catch((error) => {
    //             console.error("Error during sign out:", error);
    //         });
    // };

    return (
        <main className="antialiased overflow-x-hidden max-w-7xl mx-auto relative z-10 pb-20">
            <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <MacroDataSection refreshKey={refreshKey} selectedDate={selectedDate} />
            <MealSection refreshKey={refreshKey} onTriggerRerender={triggerRefresh} selectedDate={selectedDate} />
            <NavBar refreshKey={refreshKey} onTriggerRerender={triggerRefresh} selectedDate={selectedDate} />

        </main>
    );
}

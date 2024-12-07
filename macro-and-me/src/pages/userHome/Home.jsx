import MacroDataSection from "./components/MacroDataSection";
import MealSection from "./components/MealSection";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { useRefresh } from "./context/RefreshContext";
import DatePicker from "./components/DatePicker";
import { useState } from "react";

export default function Home() {
    const { refreshKey, triggerRefresh } = useRefresh(); 
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                console.log("User signed out.");
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error during sign out:", error);
            });
    };

    return (
        <main className="antialiased overflow-x-hidden max-w-7xl mx-auto relative z-10">
            <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

            <MacroDataSection refreshKey={refreshKey} selectedDate={selectedDate} /> 
            <MealSection refreshKey={refreshKey} onTriggerRerender={triggerRefresh} selectedDate={selectedDate}/> 
            <NavBar selectedDate={selectedDate} />
        </main>
    );
}

import Header from "./components/MacroDataSection";
import MealSection from "./components/MealSection";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";
import { useRefresh } from "./context/RefreshContext";

export default function Home() {
    const { refreshKey, triggerRefresh } = useRefresh(); 
    const navigate = useNavigate();

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
            <Header refreshKey={refreshKey} /> 
            <MealSection refreshKey={refreshKey} onTriggerRerender={triggerRefresh} /> 
            <NavBar refreshKey={refreshKey} onTriggerRerender={triggerRefresh} />
        </main>
    );
}

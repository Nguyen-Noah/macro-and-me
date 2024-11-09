import MacroDataSection from "./components/MacroDataSection";
import MealSection from "./components/MealSection";
import NavBar from "./components/NavBar";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConfig";

export default function Home() {
    
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut().then(() => {
            console.log("User signed out.");
            navigate("/login");
        }).catch((error) => {
            console.error("Error during sign out:", error);
        });
    };

return (
    <div className="flex flex-col items-center min-h-screen p-8 font-sans bg-gradient-to-tl from-slate-800 via-slate-600 to-slate-800 mb-14 pb-14">
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>

    <header className="flex justify-between items-center w-full max-w-xs">
        <button className="text-xl text-black">{'<'}</button>
        <h1 className="text-xl font-semibold text-black">Today</h1>
    </header>


    <div className="flex flex-col flex-grow items-center w-screen max-w-full h-5/6 mt-5">
        <MacroDataSection />
        <MealSection />
    </div>

    <footer className="w-full fixed bottom-0 shadow-md">
        <NavBar/>
    </footer>

    </div>
);
}

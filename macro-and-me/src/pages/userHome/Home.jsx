import Header from "./components/Header";
import MealSection from "./components/MealSection";
import NavBar from "./components/NavBar";

export default function Home() {

return (
    <>
        <main className='antialiased overflow-x-hidden max-w-7xl mx-auto relative z-10'>
            <Header />
            <MealSection />
            <NavBar/>
        </main>
    </>
);
}

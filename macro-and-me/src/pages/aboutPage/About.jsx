import React from "react";
import { Link } from "react-router-dom";  
import choice from "../../utils.js";

const homePageBackground = ["fries", "salad", "lime", "carbs"];

export default function About() {
    return (
        <div
            className="absolute inset-0 bg-fixed bg-cover bg-center h-screen overflow-y-scroll"
            style={{ backgroundImage: `url('/assets/backgrounds/${choice(homePageBackground)}.jpg')` }}
        >
            <div className="absolute inset-0 bg-stone-800 bg-opacity-50 overflow-y-scroll">
                <div className="relative z-10 flex flex-col items-center justify-center pt-28 pb-5">
                    <header className="">
                        <img src="/assets/logos/logoTexted.png" width={500} height={500} alt="logo" />
                    </header>

                    <div className="flex flex-col items-center justify-center h-full text-stone-900 -mt-12">
                        <p>Track your macro nutrients and more.</p>
                        <Link to="/login">
                            <button className="mt-4 px-6 py-2 bg-slate-600 text-stone-100 rounded-md hover:bg-slate-700 hover:text-stone-50">
                                Let's get started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

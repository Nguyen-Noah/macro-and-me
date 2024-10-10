import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../firebase";  
import firebase from "firebase/compat/app"; 
import "firebase/compat/auth"; 

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();
    const [signUp, setSignUp] = useState(false);

    const handleAuth = () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)  
            .then(() => {
                return auth.signInWithPopup(provider);  
            })
            .then((result) => {
                setUser(result.user);
                navigate("/home");  
            })
            .catch((error) => {
                console.error("Error during Google sign-in:", error);
                setErrorMessage(error.message);  
            });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(null);

        try {
            await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION); 
            let userCredential;
            if (signUp) {
                userCredential = await auth.createUserWithEmailAndPassword(email, password);
            } else {
                userCredential = await auth.signInWithEmailAndPassword(email, password);
            }
            setUser(userCredential.user);
            navigate("/home");  
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div
            className="absolute inset-0 bg-fixed bg-cover bg-center h-screen overflow-y-scroll"
            style={{ backgroundImage: `url('/assets/backgrounds/fries.jpg')` }}
        >
            <div className="absolute inset-0 bg-stone-800 bg-opacity-50 overflow-y-scroll">
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pb-5">
                    <h1 className="text-3xl font-bold mb-6 text-stone-900">
                        {signUp ? "Sign Up" : "Login"}
                    </h1>
                    <form onSubmit={handleSubmit} className="bg-slate-700 bg-opacity-20 p-6 rounded-xl shadow-inner w-80">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-stone-100 mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full p-2 rounded-md text-stone-800 border-2 focus:border-stone-700 focus:outline-none"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-stone-100 mb-2 select-none">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full p-2 rounded-md text-stone-800 border-2 focus:border-stone-700 focus:outline-none"
                                required
                            />
                        </div>
                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                        <button
                            type="submit"
                            className="w-full bg-slate-600 text-stone-50 py-2 rounded-md hover:bg-slate-700 hover:rounded-xl transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
                        >
                            {signUp ? "Sign Up" : "Login"}
                        </button>
                        <div className="flex flex-col justify-center items-center">
                            <button
                                className="bg-stone-100 text-stone-50 py-2 rounded-lg mt-3 hover:bg-stone-200 hover:rounded-xl transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
                                onClick={handleAuth}
                            >
                                <div className="flex flex-row px-3 justify-center items-center text-stone-800">
                                    {/* Google Sign-in SVG */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 256 262">
                                        <path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
                                        <path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
                                        <path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/>
                                        <path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
                                    </svg> 
                                    <p className="px-2 py-1">Continue with Google</p>
                                </div>
                            </button>
                        </div>
                        <p className="mt-4 text-stone-100">
                            {signUp ? "Already have an account?" : "Don't have an account?"}
                            <button
                                type="button"
                                className="text-blue-500 hover:underline ml-2"
                                onClick={() => setSignUp(!signUp)}
                            >
                                {signUp ? "Login" : "Sign Up"}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

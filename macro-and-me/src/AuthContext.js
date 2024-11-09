import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

     useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
    }, [auth]); // eslint-disable-line react-hooks/exhaustive-deps

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
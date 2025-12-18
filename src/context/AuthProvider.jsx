import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from "../firebase/firebase.config";
import axiosPublic from "../api/axiosPublic";
import axiosSecure from "../api/axiosSecure";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = getAuth(firebaseApp);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        setUser(currentUser);

        try {
       
          await axiosPublic.post("/users", {
            email: currentUser.email,
            name: currentUser.displayName,
          });

         
          const res = await axiosSecure.get("/users/role");
          setRole(res.data.role || "user");
        } catch (err) {
          console.error("AuthProvider error:", err);
          setRole("user");
        }
      } else {
     
        setUser(null);
        setRole("user");
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      setRole("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import firebaseApp from "../firebase/firebase.config";
import axiosPublic from "../api/axiosPublic";

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
          // Create user in DB (if not exists)
          await axiosPublic.post("/api/users", {
            email: currentUser.email,
            name: currentUser.displayName,
          });

          // Get role from backend
          const token = await currentUser.getIdToken();
          const res = await axiosPublic.get("/api/users/role", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setRole(res.data.role || "user");
        } catch (err) {
          console.error("AuthProvider error:", err);
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
    await signOut(auth);
    setUser(null);
    setRole("user");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

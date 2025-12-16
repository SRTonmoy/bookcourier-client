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
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        setUser(currentUser);

        try {
          // 1️⃣ Create user in backend if not exists
          await axiosPublic.post("/users", {
            email: currentUser.email,
            name: currentUser.displayName,
          });

          // 2️⃣ Get backend JWT
          const jwtRes = await axiosPublic.post("/jwt", {
            email: currentUser.email,
          });

          const token = jwtRes.data.token;
          setJwtToken(token);

          // 3️⃣ Get role using backend JWT
          const res = await axiosPublic.get("/users/role", {
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
        setJwtToken(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setRole("user");
    setJwtToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, jwtToken }}>
      {children}
    </AuthContext.Provider>
  );
};

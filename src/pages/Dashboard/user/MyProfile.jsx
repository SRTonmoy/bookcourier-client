// MyProfile.jsx
import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function MyProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");

  const handleUpdate = async (e) => {
    e.preventDefault();
    alert("Profile updated (mock)");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <form onSubmit={handleUpdate} className="max-w-md">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full mb-4"
        />
        <button className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

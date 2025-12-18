import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { updateProfile } from "firebase/auth";

export default function MyProfile() {
  const { user } = useAuth(); // Firebase user
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const showToast = (type, message) => {
    window.dispatchEvent(
      new CustomEvent("show-toast", { detail: { type, message, duration: 3000 } })
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });

      showToast("success", "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      showToast("error", "Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <form onSubmit={handleUpdate} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Update
        </button>
      </form>

      {photoURL && (
        <div className="mt-4">
          <p className="font-medium mb-2">Preview:</p>
          <img
            src={photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { useAuth } from '../../utils/AuthProvider';
import { auth } from '../../firebase.config';
import { updateProfile } from 'firebase/auth';

export default function MyProfile(){
  const { user } = useAuth();
  const [name, setName] = React.useState(user?.displayName || '');

  const handleSave = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      alert('Profile updated');
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h3 className="text-xl mb-4">My Profile</h3>
      <div className="card p-4 w-full max-w-md">
        <label>Name</label>
        <input className="input input-bordered mb-2" value={name} onChange={e => setName(e.target.value)} />
        <label>Email</label>
        <input className="input input-bordered mb-2" value={user?.email} readOnly />
        <div className="mt-2">
          <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

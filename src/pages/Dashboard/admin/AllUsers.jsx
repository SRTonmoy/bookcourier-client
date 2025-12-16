import { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

export default function AllUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosSecure.get("/users").then(res => setUsers(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Users</h2>

      <table className="table">
        <thead>
          <tr><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

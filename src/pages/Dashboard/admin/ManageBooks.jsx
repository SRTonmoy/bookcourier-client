import { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axiosSecure.get("/books").then(res => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Books</h2>

      {books.map(b => (
        <div key={b._id} className="border p-3 mb-2">
          {b.bookName}
        </div>
      ))}
    </div>
  );
}

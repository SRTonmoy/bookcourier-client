import { useEffect, useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

export default function MyBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axiosSecure.get("/books/my").then(res => setBooks(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Books</h2>

      <ul className="space-y-2">
        {books.map(b => (
          <li key={b._id} className="p-3 border rounded">
            {b.bookName} — ${b.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

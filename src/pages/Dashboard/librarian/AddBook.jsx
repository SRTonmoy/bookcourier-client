import { useState } from "react";
import axiosSecure from "../../../api/axiosSecure";

export default function AddBook() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosSecure.post("/books", form);
    alert("Book added");
    e.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-3">
      <h2 className="text-xl font-semibold">Add Book</h2>

      <input placeholder="Book Name" onChange={e=>setForm({...form, bookName:e.target.value})} className="input input-bordered w-full" />
      <input placeholder="Author" onChange={e=>setForm({...form, author:e.target.value})} className="input input-bordered w-full" />
      <input placeholder="Price" type="number" onChange={e=>setForm({...form, price:e.target.value})} className="input input-bordered w-full" />
      <input placeholder="Image URL" onChange={e=>setForm({...form, image:e.target.value})} className="input input-bordered w-full" />

      <button className="btn btn-primary">Add</button>
    </form>
  );
}

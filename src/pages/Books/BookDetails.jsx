import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPublic from "../../api/axiosPublic";
import { useAuth } from "../../hooks/useAuth";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await axiosPublic.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("FAILED TO LOAD BOOK", err);
      }
    };

    fetchBook();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setOrdering(true);

      const payload = {
        bookId: id,
        bookName: book.bookName,
        price: book.price || 0,
        userEmail: user.email,
        userName: user.displayName,
        status: "pending",
        orderedAt: new Date(),
      };

      const res = await axiosPublic.post("/orders", payload);

      if (res.data?.insertedId || res.data?.success) {
        alert("Order placed successfully ✅");
        navigate("/dashboard/my-orders");
      } else {
        alert("Failed to place order ❌");
      }
    } catch (error) {
      console.error("ORDER FAILED", error);
      alert("Something went wrong ❌");
    } finally {
      setOrdering(false);
    }
  };

  if (!book) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <img
          src={book.image || "/assets/images/book-placeholder.png"}
          alt={book.bookName}
          className="w-full h-96 object-cover rounded"
        />

        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold">{book.bookName}</h2>
          <p className="text-muted">By {book.author}</p>

          <p className="mt-4">
            {book.description || "No description available"}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              className="btn btn-primary"
              onClick={handleOrder}
              disabled={ordering}
            >
              {ordering ? "Placing Order..." : "Order Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

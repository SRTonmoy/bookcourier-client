import { createOrder } from "../../services/orderService";
import { useAuth } from "../../hooks/useAuth";

export default function PaymentPage({ books, total }) {
  const { user } = useAuth();

  const handlePayment = async () => {
    const order = {
      userEmail: user.email,
      books,
      totalPrice: total,
      paymentMethod: "cash",
    };

    await createOrder(order);
    alert("Order placed. Pay on delivery.");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Cash on Delivery</h2>

      <p>Total Amount: <b>${total}</b></p>

      <button
        onClick={handlePayment}
        className="btn btn-primary mt-4 w-full"
      >
        Confirm Order
      </button>
    </div>
  );
}

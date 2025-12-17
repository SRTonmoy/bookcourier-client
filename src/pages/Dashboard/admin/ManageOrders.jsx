import { useQuery } from "@tanstack/react-query";
import { getAllOrders, confirmPayment } from "../../../services/orderService";

export default function ManageOrders() {
  const { data: orders = [], refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  return (
    <div>
      <h2 className="text-2xl mb-4">Manage Orders</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.data?.map(order => (
            <tr key={order._id}>
              <td>{order.userEmail}</td>
              <td>${order.totalPrice}</td>
              <td>{order.paymentStatus}</td>
              <td>
                {order.paymentStatus === "pending" && (
                  <button
                    onClick={async () => {
                      await confirmPayment(order._id);
                      refetch();
                    }}
                    className="btn btn-sm btn-success"
                  >
                    Mark Paid
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

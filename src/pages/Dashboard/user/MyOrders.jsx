import DashboardStats from "../../../components/DashboardStats";

export default function MyOrders() {
  const stats = [
    { label: "Total Orders", value: 12 },
    { label: "Pending", value: 3 },
    { label: "Delivered", value: 9 },
    { label: "Wishlist", value: 5 },
  ];

  return (
    <>
      <DashboardStats stats={stats} />
      <h2 className="text-xl font-bold">My Orders</h2>
    </>
  );
}

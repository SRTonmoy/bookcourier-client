import DashboardStats from "../../../components/DashboardStats";

export default function MyBooks() {
  const stats = [
    { label: "Total Books", value: 24 },
    { label: "Available", value: 18 },
    { label: "Out of Stock", value: 6 },
    { label: "Orders", value: 31 },
  ];

  return (
    <>
      <DashboardStats stats={stats} />
      <h2 className="text-xl font-bold">My Books</h2>
    </>
  );
}

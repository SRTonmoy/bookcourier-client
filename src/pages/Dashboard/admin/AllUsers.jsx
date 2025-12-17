import DashboardStats from "../../../components/DashboardStats";

export default function AllUsers() {
  const stats = [
    { label: "Total Users", value: 120 },
    { label: "Admins", value: 2 },
    { label: "Librarians", value: 5 },
    { label: "Customers", value: 113 },
  ];

  return (
    <>
      <DashboardStats stats={stats} />
      <h2 className="text-xl font-bold">All Users</h2>
    </>
  );
}

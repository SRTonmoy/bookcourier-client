export default function DashboardStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((s, i) => (
        <div key={i} className="bg-base-200 rounded-xl p-6 shadow">
          <h4 className="text-sm opacity-70">{s.label}</h4>
          <p className="text-3xl font-bold mt-2">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

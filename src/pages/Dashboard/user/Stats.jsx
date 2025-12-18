import {
  BarChart3,
  Users,
  BookOpen,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';

export default function Stats() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">Platform Statistics</h2>
        <p className="text-base-content/60 mt-1">
          Overview of platform activity and growth
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value="1,245"
          icon={<Users size={24} />}
          color="primary"
          change="+12%"
        />

        <StatCard
          title="Books Available"
          value="3,890"
          icon={<BookOpen size={24} />}
          color="secondary"
          change="+8%"
        />

        <StatCard
          title="Orders Placed"
          value="9,432"
          icon={<ShoppingCart size={24} />}
          color="accent"
          change="+18%"
        />

        <StatCard
          title="Monthly Growth"
          value="24%"
          icon={<TrendingUp size={24} />}
          color="success"
          change="+5%"
        />

      </div>

      {/* ACTIVITY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART PLACEHOLDER */}
        <div className="lg:col-span-2 card bg-base-100 border border-base-300/50 shadow-sm">
          <div className="card-body">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} />
              <h3 className="font-semibold text-lg">Monthly Activity</h3>
            </div>

            {/* STATIC GRAPH */}
            <div className="flex items-end gap-3 h-48">
              {[40, 65, 50, 80, 70, 95, 60].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-lg bg-primary/70 hover:bg-primary transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-xs mt-2 text-base-content/60">
                    {['Jan','Feb','Mar','Apr','May','Jun','Jul'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="card bg-base-100 border border-base-300/50 shadow-sm">
          <div className="card-body">
            <h3 className="font-semibold text-lg mb-4">Quick Summary</h3>

            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>New Users</span>
                <span className="font-medium">+120</span>
              </li>
              <li className="flex justify-between">
                <span>Books Added</span>
                <span className="font-medium">+86</span>
              </li>
              <li className="flex justify-between">
                <span>Orders Completed</span>
                <span className="font-medium">+430</span>
              </li>
              <li className="flex justify-between">
                <span>Pending Orders</span>
                <span className="font-medium text-warning">32</span>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-lg bg-base-200 text-xs text-base-content/60">
              This page currently displays static demo statistics.
              Live analytics will be integrated in future updates.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- STAT CARD ---------- */

function StatCard({ title, value, icon, color, change }) {
  return (
    <div className="card bg-base-100 border border-base-300/50 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
            {icon}
          </div>
        </div>
        <p className="text-sm mt-3 text-success">
          {change} from last month
        </p>
      </div>
    </div>
  );
}

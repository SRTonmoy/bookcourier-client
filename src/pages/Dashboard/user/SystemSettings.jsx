import {
  Shield,
  Settings,
  Bell,
  Lock,
  Globe,
  Database,
  Mail,
  AlertTriangle
} from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-base-content/60 mt-1">
          Manage platform configuration and preferences
        </p>
      </div>

      {/* SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* GENERAL SETTINGS */}
        <SettingsCard
          title="General Settings"
          icon={<Settings size={20} />}
        >
          <Toggle label="Maintenance Mode" />
          <Toggle label="Enable User Registration" defaultChecked />
          <Toggle label="Allow Guest Browsing" defaultChecked />
        </SettingsCard>

        {/* SECURITY */}
        <SettingsCard
          title="Security"
          icon={<Lock size={20} />}
        >
          <Toggle label="Two-Factor Authentication" defaultChecked />
          <Toggle label="Force Strong Passwords" defaultChecked />
          <Toggle label="Auto Logout Inactive Users" />
        </SettingsCard>

        {/* NOTIFICATIONS */}
        <SettingsCard
          title="Notifications"
          icon={<Bell size={20} />}
        >
          <Toggle label="Email Alerts" defaultChecked />
          <Toggle label="Admin Notifications" defaultChecked />
          <Toggle label="System Error Reports" defaultChecked />
        </SettingsCard>

        {/* SYSTEM */}
        <SettingsCard
          title="System"
          icon={<Database size={20} />}
        >
          <Select label="Database Backup Frequency" options={['Daily', 'Weekly', 'Monthly']} />
          <Select label="Log Retention" options={['7 Days', '30 Days', '90 Days']} />
        </SettingsCard>

        {/* EMAIL */}
        <SettingsCard
          title="Email Configuration"
          icon={<Mail size={20} />}
        >
          <Input label="Sender Email" value="noreply@bookcenter.com" />
          <Input label="SMTP Host" value="smtp.mailserver.com" />
        </SettingsCard>

        {/* REGION */}
        <SettingsCard
          title="Region & Language"
          icon={<Globe size={20} />}
        >
          <Select label="Default Language" options={['English', 'বাংলা']} />
          <Select label="Time Zone" options={['UTC', 'GMT+6 (Bangladesh)']} />
        </SettingsCard>

      </div>

      {/* DANGER ZONE */}
      <div className="card border border-error/30 bg-error/5">
        <div className="card-body">
          <div className="flex items-center gap-2 text-error mb-3">
            <AlertTriangle size={20} />
            <h3 className="font-semibold text-lg">Danger Zone</h3>
          </div>

          <p className="text-sm text-base-content/60 mb-4">
            These actions are irreversible. Proceed with caution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="btn btn-error btn-outline">
              Reset System
            </button>
            <button className="btn btn-error">
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="text-xs text-base-content/50">
        This page currently uses static demo settings.  
        Live system configuration will be enabled in future updates.
      </div>

    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function SettingsCard({ title, icon, children }) {
  return (
    <div className="card bg-base-100 border border-base-300/50 shadow-sm">
      <div className="card-body space-y-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, defaultChecked = false }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" className="toggle toggle-primary" defaultChecked={defaultChecked} />
    </label>
  );
}

function Select({ label, options }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <select className="select select-bordered select-sm">
        {options.map(opt => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}

function Input({ label, value }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        type="text"
        defaultValue={value}
        className="input input-bordered input-sm"
      />
    </label>
  );
}

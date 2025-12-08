import { Settings as SettingsIcon } from 'lucide-react';

export function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Configure your media server</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
        <SettingsIcon size={48} className="text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Settings page coming soon</p>
        <p className="text-gray-500 text-sm mt-2">
          This section will allow you to configure server settings, user preferences, and more.
        </p>
      </div>
    </div>
  );
}

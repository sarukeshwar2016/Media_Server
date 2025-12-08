import { useState } from 'react';
import { ServerStatusCard } from '../components/ServerStatusCard';
import { SystemStatsCard } from '../components/SystemStatsCard';
import { JellyfinStatsCard } from '../components/JellyfinStatsCard';
import { QuickActionsCard } from '../components/QuickActionsCard';

export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActionComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Server Overview</h1>
        <p className="text-gray-400">Jellyfin Docker Container & System Health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div key={`status-${refreshKey}`}>
          <ServerStatusCard />
        </div>
        <SystemStatsCard />
        <div key={`jellyfin-${refreshKey}`}>
          <JellyfinStatsCard />
        </div>
        <QuickActionsCard onActionComplete={handleActionComplete} />
      </div>
    </div>
  );
}

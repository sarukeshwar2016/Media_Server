import { useEffect, useState } from 'react';
import { getJellyfinStats, JellyfinStats } from '../api/client';
import { Users, Activity, Info, AlertCircle } from 'lucide-react';

export function JellyfinStatsCard() {
  const [stats, setStats] = useState<JellyfinStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJellyfinStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-white">Jellyfin Stats</h2>
      </div>

      {loading && !stats ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : stats ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={18} />
              <span>Total Users</span>
            </div>
            <span className="text-2xl font-bold text-white">{stats.total_users}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Activity size={18} />
              <span>Active Sessions</span>
            </div>
            <span className="text-2xl font-bold text-green-400">{stats.active_sessions}</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2 text-gray-400">
              <Info size={18} />
              <span>Version</span>
            </div>
            <span className="text-white font-medium">{stats.version}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

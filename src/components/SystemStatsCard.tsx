import { useEffect, useState } from 'react';
import { getSystemStats, SystemStats } from '../api/client';
import { Cpu, HardDrive, Clock, AlertCircle } from 'lucide-react';

export function SystemStatsCard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSystemStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (percent: number) => {
    if (percent >= 80) return 'bg-red-500';
    if (percent >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <Cpu className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-white">System Resources</h2>
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
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">CPU Usage</span>
              <span className="text-white font-medium">{stats.cpu_percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(stats.cpu_percent)}`}
                style={{ width: `${stats.cpu_percent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Memory Usage</span>
              <span className="text-white font-medium">{stats.memory_percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(stats.memory_percent)}`}
                style={{ width: `${stats.memory_percent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-400">Disk Usage</span>
              <span className="text-white font-medium">{stats.disk_percent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getUsageColor(stats.disk_percent)}`}
                style={{ width: `${stats.disk_percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
            <Clock size={16} className="text-gray-400" />
            <span className="text-gray-400">Uptime:</span>
            <span className="text-white font-medium">{stats.uptime}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

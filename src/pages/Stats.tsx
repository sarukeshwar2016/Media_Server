import { useEffect, useState } from 'react';
import { getSystemStats, SystemStats as SystemStatsType } from '../api/client';
import { Cpu, HardDrive, Clock, AlertCircle } from 'lucide-react';

export function Stats() {
  const [stats, setStats] = useState<SystemStatsType | null>(null);
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
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (percent: number) => {
    if (percent >= 80) return 'bg-red-500';
    if (percent >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getUsageText = (percent: number) => {
    if (percent >= 80) return 'text-red-400';
    if (percent >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">System Statistics</h1>
        <p className="text-gray-400">Detailed resource usage and system information</p>
      </div>

      {loading && !stats ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="text-gray-400">Loading system stats...</div>
        </div>
      ) : error ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-blue-500" size={32} />
              <div>
                <h2 className="text-xl font-semibold text-white">CPU Usage</h2>
                <p className="text-sm text-gray-400">Processor utilization</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getUsageText(stats.cpu_percent)}`}>
                {stats.cpu_percent.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
                <div
                  className={`h-4 rounded-full ${getUsageColor(stats.cpu_percent)} transition-all duration-500`}
                  style={{ width: `${stats.cpu_percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="text-blue-500" size={32} />
              <div>
                <h2 className="text-xl font-semibold text-white">Memory Usage</h2>
                <p className="text-sm text-gray-400">RAM utilization</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getUsageText(stats.memory_percent)}`}>
                {stats.memory_percent.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
                <div
                  className={`h-4 rounded-full ${getUsageColor(stats.memory_percent)} transition-all duration-500`}
                  style={{ width: `${stats.memory_percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <HardDrive className="text-blue-500" size={32} />
              <div>
                <h2 className="text-xl font-semibold text-white">Disk Usage</h2>
                <p className="text-sm text-gray-400">Media storage</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${getUsageText(stats.disk_percent)}`}>
                {stats.disk_percent.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 mt-4">
                <div
                  className={`h-4 rounded-full ${getUsageColor(stats.disk_percent)} transition-all duration-500`}
                  style={{ width: `${stats.disk_percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold text-white">System Uptime</h2>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.uptime}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

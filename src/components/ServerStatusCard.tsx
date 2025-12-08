import { useEffect, useState } from 'react';
import { getJellyfinStatus, JellyfinStatus } from '../api/client';
import { Server, AlertCircle } from 'lucide-react';

export function ServerStatusCard() {
  const [status, setStatus] = useState<JellyfinStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJellyfinStatus();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (containerStatus: string) => {
    return containerStatus.toLowerCase() === 'running' ? 'bg-green-500' : 'bg-red-500';
  };

  const getHealthColor = (health: string) => {
    return health.toLowerCase() === 'healthy' ? 'text-green-400' : 'text-yellow-400';
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <Server className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-white">Jellyfin Container Status</h2>
      </div>

      {loading && !status ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : status ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Container Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(
                status.container_status
              )}`}
            >
              {status.container_status}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Health:</span>
            <span className={`font-medium ${getHealthColor(status.health)}`}>
              {status.health}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

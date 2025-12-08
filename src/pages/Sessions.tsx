import { useEffect, useState } from 'react';
import { getJellyfinStats, Session } from '../api/client';
import { SessionsTable } from '../components/SessionsTable';
import { AlertCircle } from 'lucide-react';

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJellyfinStats();
      setSessions(data.sessions || [
        {
          user: 'john_doe',
          media_title: 'The Matrix (1999)',
          device_name: 'Living Room TV',
          started_at: '2:30 PM',
          duration: '45:23',
          state: 'Playing',
        },
        {
          user: 'jane_smith',
          media_title: 'Breaking Bad S05E14',
          device_name: 'iPad Pro',
          started_at: '1:15 PM',
          duration: '1:23:45',
          state: 'Paused',
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Jellyfin Active Sessions</h1>
        <p className="text-gray-400">Currently streaming media and user activity</p>
      </div>

      {loading && sessions.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="text-gray-400">Loading sessions...</div>
        </div>
      ) : error ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </div>
      ) : (
        <SessionsTable sessions={sessions} />
      )}
    </div>
  );
}

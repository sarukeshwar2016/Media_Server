import { useState } from 'react';
import { restartJellyfin, startJellyfin, stopJellyfin } from '../api/client';
import { useToast } from '../contexts/ToastContext';
import { Power, RotateCw, Square } from 'lucide-react';

interface QuickActionsCardProps {
  onActionComplete?: () => void;
}

export function QuickActionsCard({ onActionComplete }: QuickActionsCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleAction = async (
    action: 'restart' | 'start' | 'stop',
    actionFn: () => Promise<{ ok: boolean; message: string }>
  ) => {
    setLoading(action);
    try {
      const result = await actionFn();
      if (result.ok) {
        showToast(result.message, 'success');
        onActionComplete?.();
      } else {
        showToast(result.message, 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Action failed', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <RotateCw className="text-blue-500" size={24} />
        <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleAction('restart', restartJellyfin)}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors font-medium"
        >
          <RotateCw size={18} />
          {loading === 'restart' ? 'Restarting...' : 'Restart Jellyfin'}
        </button>

        <button
          onClick={() => handleAction('start', startJellyfin)}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors font-medium"
        >
          <Power size={18} />
          {loading === 'start' ? 'Starting...' : 'Start Jellyfin'}
        </button>

        <button
          onClick={() => handleAction('stop', stopJellyfin)}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors font-medium"
        >
          <Square size={18} />
          {loading === 'stop' ? 'Stopping...' : 'Stop Jellyfin'}
        </button>
      </div>
    </div>
  );
}

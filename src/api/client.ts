const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface JellyfinStatus {
  container_status: string;
  health: string;
}

interface SystemStats {
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  uptime: string;
}

interface JellyfinStats {
  active_sessions: number;
  total_users: number;
  version: string;
  sessions?: Session[];
}

interface Session {
  user: string;
  media_title: string;
  device_name: string;
  started_at: string;
  duration: string;
  state: 'Playing' | 'Paused';
}

interface ControlResponse {
  ok: boolean;
  message: string;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function getJellyfinStatus(): Promise<JellyfinStatus> {
  const response = await fetch(`${BASE_URL}/api/status/jellyfin`);
  return handleResponse<JellyfinStatus>(response);
}

export async function getSystemStats(): Promise<SystemStats> {
  const response = await fetch(`${BASE_URL}/api/stats/system`);
  return handleResponse<SystemStats>(response);
}

export async function getJellyfinStats(): Promise<JellyfinStats> {
  const response = await fetch(`${BASE_URL}/api/stats/jellyfin`);
  return handleResponse<JellyfinStats>(response);
}

export async function restartJellyfin(): Promise<ControlResponse> {
  const response = await fetch(`${BASE_URL}/api/control/jellyfin/restart`, {
    method: 'POST',
  });
  return handleResponse<ControlResponse>(response);
}

export async function startJellyfin(): Promise<ControlResponse> {
  const response = await fetch(`${BASE_URL}/api/control/jellyfin/start`, {
    method: 'POST',
  });
  return handleResponse<ControlResponse>(response);
}

export async function stopJellyfin(): Promise<ControlResponse> {
  const response = await fetch(`${BASE_URL}/api/control/jellyfin/stop`, {
    method: 'POST',
  });
  return handleResponse<ControlResponse>(response);
}

export type { JellyfinStatus, SystemStats, JellyfinStats, Session, ControlResponse };

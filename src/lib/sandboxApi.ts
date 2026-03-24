const API_BASE = 'https://api.n8ngalaxy.com';
const API_SECRET = import.meta.env.VITE_SANDBOX_API_SECRET;

export async function provisionSandbox(params: {
  sessionId: string;
  tier: string;
  userId: string;
  orderId: string;
}): Promise<{
  success: boolean;
  url: string;
  username: string;
  password: string;
  expiresAt: string;
  containerName: string;
}> {
  const res = await fetch(`${API_BASE}/api/provision`, {
    method: 'POST',
    headers: {
      'X-API-Secret': API_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to provision sandbox');
  }

  return data;
}

export async function destroySandbox(params: {
  containerName: string;
  sessionId: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/destroy`, {
    method: 'POST',
    headers: {
      'X-API-Secret': API_SECRET,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to destroy sandbox');
  }
}

export async function getSandboxStatus(
  containerName: string,
): Promise<'running' | 'stopped' | 'not_found'> {
  const res = await fetch(`${API_BASE}/api/status/${containerName}`, {
    method: 'GET',
    headers: {
      'X-API-Secret': API_SECRET,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to get sandbox status');
  }

  const data = await res.json();
  return data.status;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const ADMIN_KEY_STORAGE = 'admin_api_key';

export class AdminApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
  }
}

export function getStoredApiKey(): string | null {
  return localStorage.getItem(ADMIN_KEY_STORAGE);
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

function getHeaders(): HeadersInit {
  const apiKey = getStoredApiKey();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const text = await response.text();
      const json = JSON.parse(text);
      message = json.message || json.error || message;
    } catch {
      // Use default message
    }
    throw new AdminApiError(response.status, message);
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text);
}

export async function adminGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getHeaders(),
  });
  return handleResponse<T>(response);
}

export async function adminPost<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function adminPut<T>(endpoint: string, data: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

export async function adminDelete(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse<void>(response);
}

export async function verifyApiKey(key: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/posts`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': key,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

const baseUrl = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** Mensaje legible desde respuestas Nest (message string o array). */
  getDetail(): string {
    if (!this.body) return this.message;
    try {
      const j = JSON.parse(this.body) as {
        message?: string | string[];
      };
      const m = j.message;
      if (Array.isArray(m)) return m.join('. ');
      if (typeof m === 'string') return m;
    } catch {
      /* ignore */
    }
    return this.body;
  }
}

export async function api<T>(
  path: string,
  init?: RequestInit & { parseJson?: boolean },
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('sigta_token') : null;
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${baseUrl()}${path}`, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    throw new ApiError(res.statusText, res.status, text);
  }
  if (!text) return undefined as T;
  const parseJson = init?.parseJson !== false;
  if (!parseJson) return text as unknown as T;
  return JSON.parse(text) as T;
}

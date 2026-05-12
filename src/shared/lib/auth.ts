export type UserRole = 'STUDENT' | 'PROFESSOR' | 'ADMIN';

export type AuthUser = {
  id: number;
  email: string;
  role: UserRole;
  fullName: string;
};

const TOKEN_KEY = 'sigta_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function decodeJwtPayload(token: string): { role?: UserRole; sub?: number } | null {
  try {
    const part = token.split('.')[1];
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): UserRole | null {
  const p = decodeJwtPayload(token);
  return p?.role ?? null;
}

/**
 * URL base del backend (Nest). Solo variables `NEXT_PUBLIC_*` están disponibles en el cliente.
 *
 * Prioridad: `NEXT_PUBLIC_BACKEND_URL` → `NEXT_PUBLIC_API_URL` (alias legado) → desarrollo local.
 */
export function getBackendBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    '';
  if (raw) return raw.replace(/\/$/, '');
  return 'http://localhost:3001';
}

const R2_BASE = import.meta.env.VITE_R2_BASE_URL ?? '';
export function asset(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${R2_BASE}/${clean}`;
}

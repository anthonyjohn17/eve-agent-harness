export function withBase(path: string, base = import.meta.env.BASE_URL): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base || base === "/") return normalized;
  return `${base.replace(/\/$/, "")}${normalized}`;
}

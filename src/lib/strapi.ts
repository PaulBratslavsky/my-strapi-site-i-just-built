export function getStrapiURL(): string {
  return import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'
}

export function getStrapiMedia(url: string | undefined | null): string {
  if (!url) return 'https://placehold.co/800x400/e2e8f0/64748b?text=Image'
  if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('//')) return url
  return `${getStrapiURL()}${url}`
}

export async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  const baseUrl = getStrapiURL()
  const token = import.meta.env.VITE_STRAPI_API_TOKEN
  const url = new URL(path, baseUrl)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    // Return empty data for auth errors on public APIs instead of crashing
    if (res.status === 403 || res.status === 401) {
      console.warn(`Strapi ${res.status} on ${path} — retrying without auth`)
      const retryHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
      const retry = await fetch(url.toString(), { headers: retryHeaders })
      if (retry.ok) return retry.json()
    }
    throw new Error(`Strapi error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

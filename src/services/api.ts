// Generic API utility for all HTTP requests

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const isAbsolute = /^https?:\/\//.test(url);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const fullUrl = isAbsolute ? url : `${baseUrl}${url}`;
  const res = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }
  return res.json();
}

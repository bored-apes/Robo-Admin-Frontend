// Generic API utility for all HTTP requests

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const isAbsolute = /^https?:\/\//.test(url);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const fullUrl = isAbsolute ? url : `${baseUrl}${url}`;
  const token = localStorage.getItem('token') || '';

  // Determine if we should set Content-Type header
  const isFormData = options?.body instanceof FormData;
  const headers: HeadersInit = {
    ...options?.headers,
    Authorization: `Bearer ${token}`,
  };

  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, ...error };
  }

  return res.json();
}

// Specialized function for blob responses (like file downloads)
export async function apiFetchBlob(url: string, options?: RequestInit): Promise<Blob> {
  const isAbsolute = /^https?:\/\//.test(url);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const fullUrl = isAbsolute ? url : `${baseUrl}${url}`;
  const token = localStorage.getItem('token') || '';

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // Try to get error message from response if possible
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw { status: res.status, ...error };
  }

  return res.blob();
}

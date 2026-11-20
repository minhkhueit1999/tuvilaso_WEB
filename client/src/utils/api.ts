/**
 * Safe HTTP API fetch utility that guarantees no 'Unexpected end of JSON input' errors
 * even if the backend is offline, restarting, or returns an empty body.
 */
export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string | null;
}

export async function safeJsonFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    if (!text || !text.trim()) {
      return {
        ok: res.ok,
        status: res.status,
        data: null,
        error: res.ok ? null : `Lỗi HTTP ${res.status}`
      };
    }

    try {
      const parsed = JSON.parse(text);
      return {
        ok: res.ok,
        status: res.status,
        data: parsed,
        error: res.ok ? null : (parsed?.message || `Lỗi HTTP ${res.status}`)
      };
    } catch {
      return {
        ok: false,
        status: res.status,
        data: null,
        error: 'Phản hồi máy chủ không hợp lệ'
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err?.message || 'Không thể kết nối tới máy chủ'
    };
  }
}

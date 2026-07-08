export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: json.message || json.error || "Request failed",
      };
    }

    return { success: true, data: (json.data ?? json) as T };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

export const api = {
  get<T>(endpoint: string) {
    return request<T>("GET", endpoint);
  },
  post<T>(endpoint: string, body?: unknown) {
    return request<T>("POST", endpoint, body);
  },
  put<T>(endpoint: string, body?: unknown) {
    return request<T>("PUT", endpoint, body);
  },
  delete<T>(endpoint: string) {
    return request<T>("DELETE", endpoint);
  },
};

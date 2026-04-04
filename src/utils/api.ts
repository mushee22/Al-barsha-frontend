export const BASE_URL = process.env.REACT_APP_BASE_URL || "https://al-barsha.gt.tc/api";

export const getAuthToken = () => localStorage.getItem("albarsha_auth_token");

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const isFormData = options.body instanceof FormData;

  const headers: any = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Only set application/json if we are not sending FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || "An error occurred");
  }

  return response.json();
};

export const apiDownload = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: any = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || "Failed to download file");
  }

  return response.blob();
};

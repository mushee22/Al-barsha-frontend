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

export const parseFilenameFromDisposition = (disposition: string | null): string | null => {
  if (!disposition) return null;
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition);
  if (utf8?.[1]) return decodeURIComponent(utf8[1]);
  const quoted = /filename="([^"]+)"/i.exec(disposition);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(disposition);
  return plain?.[1]?.trim() || null;
};

export const apiDownloadFile = async (endpoint: string, options: RequestInit = {}) => {
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

  return {
    blob: await response.blob(),
    filename: parseFilenameFromDisposition(response.headers.get("Content-Disposition")),
  };
};

export const triggerBlobDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const openOrDownloadPdf = async (
  pdfUrl: string | undefined,
  fallbackEndpoint: string,
  options: { download?: boolean; filename?: string } = {}
) => {
  const { download = false, filename } = options;

  if (pdfUrl) {
    window.open(download ? `${pdfUrl}${pdfUrl.includes("?") ? "&" : "?"}download=1` : pdfUrl, "_blank");
    return;
  }

  const { blob, filename: headerName } = await apiDownloadFile(fallbackEndpoint);
  const resolvedName = headerName || filename || "document.pdf";

  if (download) {
    triggerBlobDownload(blob, resolvedName);
    return;
  }

  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
};

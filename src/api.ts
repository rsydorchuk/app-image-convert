async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json", ...options.headers } : options.headers,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.detail ?? "Request failed");
  return data;
}

export function me() {
  return request("/auth/me");
}

export function logout() {
  return request("/auth/logout", { method: "POST" });
}

interface CreateUploadPayload {
  filename: string;
  content_type: string;
  tool: string;
  from_format: string;
  to_format: string;
}

export function createUpload(payload: CreateUploadPayload) {
  return request("/uploads", { method: "POST", body: JSON.stringify(payload) });
}

export function getJob(jobId: string) {
  return request(`/jobs/${jobId}`);
}

export function confirmUpload(jobId: string) {
  return request(`/uploads/${jobId}/complete`, { method: "POST" });
}

export async function putToBlob(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("Upload to storage failed");
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const getContent = () => request("/content");

export const updateContent = (payload, token) =>
  request("/content", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const sendContactMessage = (payload) =>
  request("/contact", { method: "POST", body: JSON.stringify(payload) });

export const getMessages = (token) =>
  request("/contact", { headers: { Authorization: `Bearer ${token}` } });

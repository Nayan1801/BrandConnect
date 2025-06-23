dotenv.config()
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export const register = async (data) =>
  await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const login = async (data) =>
  await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const fetchWithAuth = async (url, method = "GET", body = null) =>
  await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

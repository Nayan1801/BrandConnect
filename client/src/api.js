
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


  export const getConversations = async (token) => {
  const res = await axios.get(API_BASE, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getMessages = async (conversationId, token) => {
  const res = await axios.get(`${API_BASE}/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const replyToMessage = async (conversationId, message, token) => {
  const res = await axios.post(
    `${API_BASE}/${conversationId}/reply`,
    { message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
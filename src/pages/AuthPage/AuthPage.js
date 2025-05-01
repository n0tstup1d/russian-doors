// services/authServices.js
const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      phone: userData.phone,
      password: userData.password
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

export const loginUser = async (login, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("isAdmin", data.isAdmin);
    return data;
  } catch (err) {
    throw err;
  }
};
// Токен можно хранить в localStorage (это безопасно, если используется HTTPS)
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken") || null; // Явное возвращение null вместо undefined
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};
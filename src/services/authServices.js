// services/authServices.js
const API_URL = "http://localhost:5000/api";

// Регистрация
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Авторизация
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log(JSON.stringify({ email, password }));

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    console.log("Ответ сервера:", data); // Проверьте isAdmin здесь

    localStorage.setItem("authToken", data.token);
    localStorage.setItem("isAdmin", data.isAdmin);
    console.log(data.isAdmin)

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
  return localStorage.getItem("authToken");
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};
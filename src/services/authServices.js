const API_URL = "http://localhost:5000/api";

// Обработчик ошибок
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.message || 'Ошибка сети');
    error.status = response.status;
    throw error;
  }
  return response.json();
};

// ================== Работа с токенами ==================
export const getAuthToken = () => {
  return localStorage.getItem("authToken") || null;
};

export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

// ================== Регистрация ==================
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
  return handleResponse(response);
};

// ================== Авторизация ==================
export const loginUser = async (login, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });
  
  const data = await handleResponse(response);
  setAuthToken(data.token);
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('isAdmin', data.isAdmin);
  
  return data;
};

// ================== Профиль ==================
export const getUserProfile = async () => {
  const token = getAuthToken();
  if (!token) return null;

  const response = await fetch(`${API_URL}/user`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return handleResponse(response);
};

export const updateUserProfile = async (userData) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

// ================== Смена пароля ==================
export const changePassword = async (passwords) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(passwords)
  });
  return handleResponse(response);
};

// ================== Выход ==================
export const logout = () => {
  removeAuthToken();
  localStorage.removeItem('userId');
  localStorage.removeItem('isAdmin');
};
// services/authServices.js
export const registerUser = async (data) => {
  const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
  });
  
  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
  }
};

// Добавьте проверку isAdmin при входе
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Неверные учетные данные");
  
  const { token, isAdmin } = await response.json();
  
  if (isAdmin !== 1) throw new Error("Доступ запрещен");
  
  localStorage.setItem("authToken", token);
  localStorage.setItem("isAdmin", isAdmin);
  return { isAdmin };
};
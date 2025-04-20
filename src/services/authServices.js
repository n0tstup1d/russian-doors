const USERS_KEY = 'app_users';

export const setAuthToken = (token) => {
    localStorage.setItem('authToken', token);
  };
  
  export const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const removeAuthToken = () => {
    localStorage.removeItem('authToken');
  };

export const registerUser = (user) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  if (users.some(u => u.email === user.email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  return user;
};
// src/components/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../services/authService';

const PrivateRoute = ({ children }) => {
  return getAuthToken() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
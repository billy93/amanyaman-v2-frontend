import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {isAuthenticate } from './features/auth/authSlice'

const PrivateRoute = ({ path, ...props }) => {
  const isAuthenticated = useSelector(isAuthenticate);

  return isAuthenticated ? (
    <Route {...props} path={path} />
  ) : (
    <Navigate to="/" replace />
  );
};

export default PrivateRoute;

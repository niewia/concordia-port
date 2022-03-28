import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';
import useStore from '../hooks/useStore';
import { Routes } from '../pages';

const PrivateRoute: FC = ({ children }) => {
  const { userStore } = useStore();

  return <>{!!userStore.isAuthenticated ? children : <Navigate to={Routes.login} />}</>;
};

export default PrivateRoute;

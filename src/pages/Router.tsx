import React from 'react';
import Game from './Game/Game';
import { Box } from '@mui/system';
import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Reset from './Reset/Reset';
import Dashboard from './Dashboard/Dashboard';
import PrivateRoute from '../components/PrivateRoute';
import GameLobby from './GameLobby/GameLobby';

export const Routes = {
  login: '/',
  register: '/register',
  reset: '/reset',
  dashboard: '/dashboard',
  lobby: (gameId?: string) => (gameId ? `/lobby/${gameId}` : '/lobby/:gameId'),
  newGame: '/lobby',
  game: (gameId?: string) => (gameId ? `/game/${gameId}` : '/game/:gameId'),
};

const Router = () => {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route path={Routes.login} element={<Login />} />
        <Route path={Routes.register} element={<Register />} />
        <Route path={Routes.reset} element={<Reset />} />
        <Route path={Routes.lobby()} element={<GameLobby />} />
        <Route path={Routes.newGame} element={<GameLobby />} />
        <Route
          path={Routes.dashboard}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path={Routes.game()}
          element={
            <Box
              sx={{
                height: 600,
              }}
            >
              <Game />
            </Box>
          }
        />
      </RouterRoutes>
    </BrowserRouter>
  );
};

export default Router;

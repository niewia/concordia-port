import React from 'react';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import Game from './game/Game';
import { Box } from '@mui/system';
import AppBar from './components/AppBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Reset from './pages/Reset/Reset';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <>
          <AppBar />
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/game"
                element={
                  <Box
                    sx={{
                      height: 800,
                    }}
                  >
                    <Game />
                  </Box>
                }
              />
            </Routes>
          </Router>
        </>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;

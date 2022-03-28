import React from 'react';
import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import AppBar from './components/AppBar';
import Router from './pages';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <>
          <AppBar />
          <Router />
        </>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import './assets/style/global.style.css';
import Routers from "./Router";
import { ThemeProvider } from './Context/ThemeContext.jsx';
import { AuthProvider } from './Context/AuthContext.jsx';

function App() {


  return (
    <ThemeProvider>
      <AuthProvider>
        <Routers />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

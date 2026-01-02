import React from 'react';
import './assets/style/global.style.css';
import Routers from "./Router";
import { ThemeProvider } from './Context/ThemeContext.jsx';

function App() {


  return (
    <ThemeProvider>
      <Routers />
    </ThemeProvider>
  )
}

export default App

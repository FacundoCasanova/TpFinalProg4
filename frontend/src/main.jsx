import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'; // <--- Importamos esto
import theme from './theme'; // <--- Importamos nuestro tema nuevo

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}> {/* Envolvemos con el tema */}
        <CssBaseline /> {/* Normaliza los estilos del navegador */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
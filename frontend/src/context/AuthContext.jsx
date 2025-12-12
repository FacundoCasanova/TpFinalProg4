import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // URL del Backend
  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(`${API_URL}/token`, formData);
      
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error de login:", error);
      return false;
    }
  };

  // --- REGISTER (MODIFICADO: Sin auto-login) ---
  const register = async (nombre, email, password) => {
    try {
      // Solo enviamos los datos, ignoramos el token que devuelve
      await axios.post(`${API_URL}/registro`, {
        email: email,
        nombre_completo: nombre,
        password: password,
        es_activo: true
      });
      
      // Retornamos éxito pero NO cambiamos isAuthenticated a true
      return { success: true };
    } catch (error) {
      console.error("Error de registro:", error);
      
      // Intentamos obtener el mensaje de error del backend
      let mensajeError = "Error al registrarse";
      
      if (error.response && error.response.data) {
        // Si el backend mandó un detalle (como "El email ya existe")
        if (error.response.data.detail) {
           mensajeError = error.response.data.detail;
        }
      }
      
      return { 
        success: false, 
        message: mensajeError
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
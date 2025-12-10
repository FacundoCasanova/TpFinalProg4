import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // URL de tu Backend (Python)
  const API_URL = "http://127.0.0.1:8000";

  // Verificar si ya hay un token guardado al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      // Aquí podrías pedir los datos del usuario al backend si quisieras
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // El backend espera datos de formulario (OAuth2 standard), no JSON directo
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axios.post(`${API_URL}/token`, formData);
      
      // Guardar el token en el navegador
      localStorage.setItem("token", response.data.access_token);
      setIsAuthenticated(true);
      return true; // Login exitoso
    } catch (error) {
      console.error("Error de login:", error);
      return false; // Login fallido
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
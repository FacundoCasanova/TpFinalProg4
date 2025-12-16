import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DetalleRutina from './pages/DetalleRutina'; 


const RutaPrivada = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Cargando...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <RutaPrivada>
            <Dashboard />
          </RutaPrivada>
        } />
        
        {}
        <Route path="/rutina/:id" element={
          <RutaPrivada>
            <DetalleRutina />
          </RutaPrivada>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
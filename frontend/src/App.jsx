import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import { Box, Typography, Button } from '@mui/material';

// Un componente simple para mostrar cuando ya estás logueado
const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h3">¡Bienvenido al Gimnasio! 💪</Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>Ya estás logueado.</Typography>
      <Button variant="outlined" color="error" onClick={logout}>Cerrar Sesión</Button>
    </Box>
  );
};

// Componente que decide qué pantalla mostrar
const Main = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <Login />;
};

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export default App;
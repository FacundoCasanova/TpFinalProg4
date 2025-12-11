import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // <--- Nuevo Import

const Main = () => {
  const { isAuthenticated } = useAuth();
  // Si está logueado, muestra Dashboard. Si no, Login.
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
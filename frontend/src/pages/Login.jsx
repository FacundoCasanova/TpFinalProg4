import { useState, useEffect } from 'react'; // <--- Agregamos useEffect
import { useNavigate } from 'react-router-dom'; // <--- IMPORTANTE: Importar useNavigate
import { useAuth } from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState(''); 
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  
  const { login, register, isAuthenticated } = useAuth(); // <--- Traemos isAuthenticated
  const navigate = useNavigate(); // <--- Inicializamos la navegación

  // SI YA ESTOY LOGUEADO, IR DIRECTO AL DASHBOARD
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      // --- LOGIN ---
      const exito = await login(email, password);
      if (exito) {
        navigate('/'); // <--- ¡AQUÍ ESTÁ LA MAGIA! Navegar al Dashboard
      } else {
        setError('Email o contraseña incorrectos');
      }
    } else {
      // --- REGISTRO ---
      if (!nombre.trim()) {
        setError('El nombre completo es obligatorio');
        return;
      }
      
      const resultado = await register(nombre, email, password);
      
      if (resultado.success) {
        setSuccessMsg('¡Cuenta registrada con éxito! Por favor inicia sesión.');
        setIsLogin(true); 
        setPassword('');
      } else {
        setError(resultado.message);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ m: 1, bgcolor: isLogin ? 'secondary.main' : 'primary.main' }}>
            {isLogin ? <LockOutlinedIcon /> : <PersonAddIcon />}
          </Avatar>
          
          <Typography component="h1" variant="h5">
            {isLogin ? 'Ingresar al Gym' : 'Crear Cuenta Nueva'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
            
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nombre Completo"
                autoFocus
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              autoFocus={isLogin}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color={isLogin ? "primary" : "secondary"}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
            
            <Box textAlign="center">
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMsg(''); 
                }}
              >
                {isLogin ? "¿No tienes cuenta? ¡Regístrate aquí!" : "¿Ya tienes cuenta? Inicia sesión"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
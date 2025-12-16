import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Box, TextField, Button, Typography, Paper, Alert, Link, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState(''); 
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      const exito = await login(email, password);
      if (exito) {
        navigate('/');
      } else {
        setError('Email o contraseña incorrectos');
      }
    } else {
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
    
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Container component="main" maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4 }}>
          <Avatar sx={{ m: 1, bgcolor: isLogin ? 'secondary.main' : 'primary.main', width: 56, height: 56 }}>
            {isLogin ? <LockOutlinedIcon fontSize="large" /> : <PersonAddIcon fontSize="large" />}
          </Avatar>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
            {isLogin ? 'Bienvenido al Gym' : 'Crear Nueva Cuenta'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{successMsg}</Alert>}
            
            {!isLogin && (
              <TextField margin="normal" required fullWidth label="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            )}

            <TextField margin="normal" required fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField margin="normal" required fullWidth label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color={isLogin ? "primary" : "secondary"}
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
            
            <Box textAlign="center" mt={2}>
              <Link 
                component="button" 
                variant="body2" 
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                sx={{ textDecoration: 'none', fontWeight: 'bold' }}
              >
                {isLogin ? "¿No tienes cuenta? ¡Regístrate aquí!" : "¿Ya tienes cuenta? Inicia sesión"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
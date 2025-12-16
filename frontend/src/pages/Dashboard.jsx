import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Button, Box, IconButton, Fab, AppBar, Toolbar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [rutinas, setRutinas] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [nuevaRutina, setNuevaRutina] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');

  const API_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const cargarRutinas = async () => {
    try {
      const response = await axios.get(`${API_URL}/rutinas/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRutinas(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) logout();
    }
  };

  useEffect(() => { cargarRutinas(); }, []);

  const handleCrear = async () => {
    if (!nuevaRutina.nombre.trim()) { setError("El nombre es obligatorio"); return; }
    try {
      await axios.post(`${API_URL}/rutinas/`, nuevaRutina, { headers: { Authorization: `Bearer ${token}` } });
      setOpen(false); setNuevaRutina({ nombre: '', descripcion: '' }); setError(''); cargarRutinas(); 
    } catch (error) {
      setError("Error al crear la rutina");
    }
  };

  const borrarRutina = async (id) => {
    if(!window.confirm("¿Seguro que quieres borrar esta rutina?")) return;
    try {
      await axios.delete(`${API_URL}/rutinas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      cargarRutinas();
    } catch (error) { console.error("Error borrando:", error); }
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Sistema de Gestión de Gym
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
        <Typography variant="h4" fontWeight="bold" color="primary" sx={{ mb: 4 }}>
          Mis Rutinas
        </Typography>

        <Grid container spacing={3}>
          {rutinas.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Box textAlign="center" py={8} bgcolor="white" borderRadius={4} boxShadow={1}>
                <Typography variant="h6" color="text.secondary">No tienes rutinas creadas aún.</Typography>
                <Button variant="contained" size="large" sx={{ mt: 3 }} onClick={() => setOpen(true)}>
                  Crear mi primera rutina
                </Button>
              </Box>
            </Grid>
          ) : (
            rutinas.map((rutina) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rutina.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    transition: '0.3s',
                    '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, borderColor: 'primary.main' },
                    border: '1px solid transparent'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
                      {rutina.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {rutina.descripcion || "Sin descripción"}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', px: 1, py: 0.5, borderRadius: 1 }}>
                      {new Date(rutina.fecha_creacion).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  
                  <Box sx={{ p: 2, bgcolor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/rutina/${rutina.id}`)}
                    >
                      Abrir
                    </Button>
                    <IconButton color="error" onClick={() => borrarRutina(rutina.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        <Fab color="secondary" aria-label="add" sx={{ position: 'fixed', bottom: 30, right: 30 }} onClick={() => setOpen(true)}>
          <AddIcon />
        </Fab>

        {}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>Nueva Rutina</DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box component="form" sx={{ mt: 1 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <TextField autoFocus margin="dense" label="Nombre" fullWidth variant="outlined" value={nuevaRutina.nombre} onChange={(e) => setNuevaRutina({...nuevaRutina, nombre: e.target.value})} />
              <TextField margin="dense" label="Descripción" fullWidth variant="outlined" multiline rows={3} value={nuevaRutina.descripcion} onChange={(e) => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
            <Button onClick={handleCrear} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
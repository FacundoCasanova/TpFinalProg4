import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Button, Box, IconButton, Fab, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [rutinas, setRutinas] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados para el Modal
  const [open, setOpen] = useState(false);
  const [nuevaRutina, setNuevaRutina] = useState({ nombre: '', descripcion: '' });
  const [error, setError] = useState('');

  const API_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  // --- LÓGICA DE CARGA ---
  const cargarRutinas = async () => {
    try {
      const response = await axios.get(`${API_URL}/rutinas/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRutinas(response.data);
    } catch (error) {
      console.error("Error cargando rutinas:", error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    cargarRutinas();
  }, []);

  // --- LÓGICA DE CREACIÓN ---
  const handleCrear = async () => {
    if (!nuevaRutina.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    
    try {
      await axios.post(`${API_URL}/rutinas/`, nuevaRutina, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOpen(false);
      setNuevaRutina({ nombre: '', descripcion: '' });
      setError('');
      cargarRutinas(); 
    } catch (error) {
      console.log(error);
      const mensajeReal = error.response?.data?.detail || "Error al crear la rutina";
      setError(typeof mensajeReal === 'string' ? mensajeReal : JSON.stringify(mensajeReal));
      
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  };

  // --- LÓGICA DE BORRADO ---
  const borrarRutina = async (id) => {
    if(!window.confirm("¿Seguro que quieres borrar esta rutina?")) return;
    try {
      await axios.delete(`${API_URL}/rutinas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarRutinas();
    } catch (error) {
      console.error("Error borrando:", error);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      {/* Cabecera */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FitnessCenterIcon fontSize="large" color="primary" /> Mis Rutinas
        </Typography>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}>
          Salir
        </Button>
      </Box>

      {/* Lista de Rutinas - CORREGIDO GRID */}
      <Grid container spacing={3}>
        {rutinas.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Box textAlign="center" py={5}>
              <Typography variant="h6" color="text.secondary">
                No tienes rutinas creadas aún.
              </Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpen(true)}>
                Crear mi primera rutina
              </Button>
            </Box>
          </Grid>
        ) : (
          rutinas.map((rutina) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rutina.id}>
              <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                    {rutina.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rutina.descripcion || "Sin descripción"}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 2, color: 'gray' }}>
                    Creada: {new Date(rutina.fecha_creacion).toLocaleDateString()}
                  </Typography>
                </CardContent>
                
                <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    variant="text" 
                    onClick={() => navigate(`/rutina/${rutina.id}`)}
                  >
                    Ver Ejercicios
                  </Button>
                  
                  <IconButton color="error" size="small" onClick={() => borrarRutina(rutina.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Botón Flotante */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Nueva Rutina de Entrenamiento</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              autoFocus
              margin="dense"
              label="Nombre de la Rutina"
              fullWidth
              variant="outlined"
              placeholder="Ej: Hipertrofia Pecho/Espalda"
              value={nuevaRutina.nombre}
              onChange={(e) => setNuevaRutina({...nuevaRutina, nombre: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Descripción (Opcional)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              placeholder="Objetivos, notas, duración..."
              value={nuevaRutina.descripcion}
              onChange={(e) => setNuevaRutina({...nuevaRutina, descripcion: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleCrear} variant="contained" disabled={!nuevaRutina.nombre}>
            Guardar Rutina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
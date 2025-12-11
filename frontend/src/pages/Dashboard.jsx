import { useState, useEffect } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Button, Box, IconButton, Fab 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [rutinas, setRutinas] = useState([]);
  const { logout } = useAuth();
  
  // URL del Backend
  const API_URL = "http://127.0.0.1:8000";

  // Función para cargar rutinas
  const cargarRutinas = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/rutinas/`, {
        headers: { Authorization: `Bearer ${token}` } // 🔑 Enviar credencial
      });
      setRutinas(response.data);
    } catch (error) {
      console.error("Error cargando rutinas:", error);
    }
  };

  // Cargar al iniciar la pantalla
  useEffect(() => {
    cargarRutinas();
  }, []);

  // Función para borrar (Opcional por ahora)
  const borrarRutina = async (id) => {
    if(!window.confirm("¿Seguro que quieres borrar esta rutina?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/rutinas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarRutinas(); // Recargar lista
    } catch (error) {
      console.error("Error borrando:", error);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Cabecera */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mis Rutinas 💪
        </Typography>
        <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={logout}>
          Salir
        </Button>
      </Box>

      {/* Lista de Rutinas */}
      <Grid container spacing={3}>
        {rutinas.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" align="center">
              No tienes rutinas creadas aún. ¡Empieza hoy!
            </Typography>
          </Grid>
        ) : (
          rutinas.map((rutina) => (
            <Grid item xs={12} sm={6} md={4} key={rutina.id}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {rutina.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {rutina.descripcion || "Sin descripción"}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton color="error" onClick={() => borrarRutina(rutina.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Botón Flotante para Crear */}
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => alert("¡Próximo paso: Crear el formulario!")}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}
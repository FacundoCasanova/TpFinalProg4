import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Grid, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Chip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

export default function DetalleRutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ejercicios, setEjercicios] = useState([]);
  
  const [open, setOpen] = useState(false);
  const [nuevoEjer, setNuevoEjer] = useState({
    nombre: '', dia_semana: 'Lunes', series: 3, repeticiones: 10, peso: 0, notas: ''
  });

  const API_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");

  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const cargarDatos = async () => {
    try {
      const resEjercicios = await axios.get(`${API_URL}/ejercicios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEjercicios(resEjercicios.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const handleCrear = async () => {
    try {
      await axios.post(`${API_URL}/ejercicios/?rutina_id=${id}`, nuevoEjer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpen(false);
      setNuevoEjer({ ...nuevoEjer, nombre: '' });
      cargarDatos();
    } catch (error) {
      alert("Error al crear ejercicio");
    }
  };

  const borrarEjercicio = async (idEjer) => {
    if(!window.confirm("¿Borrar ejercicio?")) return;
    try {
      await axios.delete(`${API_URL}/ejercicios/${idEjer}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarDatos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Volver
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Plan de Entrenamiento</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Agregar Ejercicio
        </Button>
      </Box>

      {/* Listado agrupado por días */}
      {dias.map((dia) => {
        const ejerciciosDelDia = ejercicios.filter(e => e.dia_semana === dia);
        if (ejerciciosDelDia.length === 0) return null;

        return (
          <Box key={dia} mb={4}>
            <Chip label={dia} color="primary" sx={{ mb: 2, fontSize: '1.2rem', p: 2 }} />
            {/* CORREGIDO GRID */}
            <Grid container spacing={2}>
              {ejerciciosDelDia.map((ej) => (
                <Grid size={{ xs: 12 }} key={ej.id}>
                  <Card variant="outlined">
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                      <Box>
                        <Typography variant="h6">{ej.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {ej.series} series x {ej.repeticiones} reps {ej.peso > 0 && `| ${ej.peso}kg`}
                        </Typography>
                        {ej.notas && <Typography variant="caption" color="gray">Nota: {ej.notas}</Typography>}
                      </Box>
                      <IconButton color="error" onClick={() => borrarEjercicio(ej.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      })}
      
      {ejercicios.length === 0 && (
        <Typography align="center" color="text.secondary" mt={5}>
          No hay ejercicios. ¡Agrega uno para empezar!
        </Typography>
      )}

      {/* Modal para agregar */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Nuevo Ejercicio</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nombre del Ejercicio" fullWidth value={nuevoEjer.nombre} onChange={(e) => setNuevoEjer({...nuevoEjer, nombre: e.target.value})} />
            
            <TextField select label="Día" fullWidth value={nuevoEjer.dia_semana} onChange={(e) => setNuevoEjer({...nuevoEjer, dia_semana: e.target.value})}>
              {dias.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>

            <Box display="flex" gap={2}>
              <TextField label="Series" type="number" fullWidth value={nuevoEjer.series} onChange={(e) => setNuevoEjer({...nuevoEjer, series: e.target.value})} />
              <TextField label="Repeticiones" type="number" fullWidth value={nuevoEjer.repeticiones} onChange={(e) => setNuevoEjer({...nuevoEjer, repeticiones: e.target.value})} />
            </Box>
            
            <TextField label="Peso (kg) - Opcional" type="number" fullWidth value={nuevoEjer.peso} onChange={(e) => setNuevoEjer({...nuevoEjer, peso: e.target.value})} />
            <TextField label="Notas" multiline rows={2} fullWidth value={nuevoEjer.notas} onChange={(e) => setNuevoEjer({...nuevoEjer, notas: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleCrear} variant="contained" disabled={!nuevoEjer.nombre}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
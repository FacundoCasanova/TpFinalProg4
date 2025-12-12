import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  Grid, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, Chip, AppBar, Toolbar 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function DetalleRutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ejercicios, setEjercicios] = useState([]);
  const [open, setOpen] = useState(false);
  const [nuevoEjer, setNuevoEjer] = useState({ nombre: '', dia_semana: 'Lunes', series: 3, repeticiones: 10, peso: 0, notas: '' });
  const API_URL = "http://127.0.0.1:8000";
  const token = localStorage.getItem("token");
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const cargarDatos = async () => {
    try {
      const resEjercicios = await axios.get(`${API_URL}/ejercicios/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEjercicios(resEjercicios.data);
    } catch (error) { console.error("Error:", error); }
  };
  useEffect(() => { cargarDatos(); }, [id]);

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20); doc.setTextColor(26, 35, 126); doc.text("Plan de Entrenamiento", 14, 22);
    doc.setFontSize(10); doc.setTextColor(100); doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28);
    let yPos = 35; 
    dias.forEach(dia => {
      const ejerciciosDia = ejercicios.filter(e => e.dia_semana === dia);
      if (ejerciciosDia.length > 0) {
        doc.setFontSize(14); doc.setTextColor(255, 111, 0); doc.text(dia, 14, yPos); yPos += 5;
        const tablaData = ejerciciosDia.map(e => [e.nombre, `${e.series} x ${e.repeticiones}`, e.peso > 0 ? `${e.peso} kg` : '-', e.notas || '-']);
        autoTable(doc, { startY: yPos, head: [['Ejercicio', 'Series/Reps', 'Peso', 'Notas']], body: tablaData, theme: 'grid', headStyles: { fillColor: [26, 35, 126] }, margin: { left: 14 } });
        yPos = doc.lastAutoTable.finalY + 15;
      }
    });
    doc.save(`rutina_gym_${id}.pdf`);
  };

  const handleCrear = async () => {
    try { await axios.post(`${API_URL}/ejercicios/?rutina_id=${id}`, nuevoEjer, { headers: { Authorization: `Bearer ${token}` } }); setOpen(false); setNuevoEjer({ ...nuevoEjer, nombre: '' }); cargarDatos(); } catch (error) { alert("Error al crear"); }
  };
  const borrarEjercicio = async (idEjer) => { if(!window.confirm("¿Borrar?")) return; try { await axios.delete(`${API_URL}/ejercicios/${idEjer}`, { headers: { Authorization: `Bearer ${token}` } }); cargarDatos(); } catch (error) { console.error(error); } };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Detalle de Rutina</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        <Box display="flex" justifyContent="flex-end" mb={3} gap={2}>
          <Button variant="outlined" color="error" startIcon={<PictureAsPdfIcon />} onClick={generarPDF} disabled={ejercicios.length === 0}>
            Descargar PDF
          </Button>
          <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            Nuevo Ejercicio
          </Button>
        </Box>

        {dias.map((dia) => {
          const ejerciciosDelDia = ejercicios.filter(e => e.dia_semana === dia);
          if (ejerciciosDelDia.length === 0) return null;
          return (
            <Box key={dia} mb={4}>
              <Chip label={dia} color="primary" sx={{ mb: 2, fontSize: '1rem', fontWeight: 'bold', px: 2 }} />
              <Grid container spacing={2}>
                {ejerciciosDelDia.map((ej) => (
                  <Grid size={{ xs: 12 }} key={ej.id}>
                    <Card variant="outlined" sx={{ borderRadius: 2, borderLeft: '5px solid #1a237e' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">{ej.nombre}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            <Box component="span" fontWeight="bold" color="secondary.main">{ej.series} series</Box> x {ej.repeticiones} reps 
                            {ej.peso > 0 && <Box component="span" sx={{ bgcolor: '#eee', px: 1, ml: 1, borderRadius: 1 }}>{ej.peso}kg</Box>}
                          </Typography>
                          {ej.notas && <Typography variant="caption" display="block" color="gray" mt={1}>📝 {ej.notas}</Typography>}
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
          <Box textAlign="center" mt={10} color="text.secondary">
            <Typography variant="h6">Esta rutina está vacía.</Typography>
            <Typography variant="body2">¡Agrega ejercicios para comenzar!</Typography>
          </Box>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white' }}>Agregar Ejercicio</DialogTitle>
          <DialogContent sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nombre del Ejercicio" fullWidth value={nuevoEjer.nombre} onChange={(e) => setNuevoEjer({...nuevoEjer, nombre: e.target.value})} />
            <TextField select label="Día" fullWidth value={nuevoEjer.dia_semana} onChange={(e) => setNuevoEjer({...nuevoEjer, dia_semana: e.target.value})}>
              {dias.map((option) => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
            </TextField>
            <Box display="flex" gap={2}>
              <TextField label="Series" type="number" fullWidth value={nuevoEjer.series} onChange={(e) => setNuevoEjer({...nuevoEjer, series: e.target.value})} />
              <TextField label="Reps" type="number" fullWidth value={nuevoEjer.repeticiones} onChange={(e) => setNuevoEjer({...nuevoEjer, repeticiones: e.target.value})} />
              <TextField label="Peso (kg)" type="number" fullWidth value={nuevoEjer.peso} onChange={(e) => setNuevoEjer({...nuevoEjer, peso: e.target.value})} />
            </Box>
            <TextField label="Notas" multiline rows={2} fullWidth value={nuevoEjer.notas} onChange={(e) => setNuevoEjer({...nuevoEjer, notas: e.target.value})} />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCrear} variant="contained" color="secondary">Guardar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
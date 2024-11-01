import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, CardContent, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert,
} from '@mui/material';

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    cedula: '',
    name: '',
    expedition_date: '',
    expedition_place: '',
    email: '',
    phone: '',
    address: '',
  });
  const [editClientId, setEditClientId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError('Error al obtener clientes.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.cedula || !form.name) {
      setError('El número de cédula y el nombre son obligatorios');
      return;
    }

    try {
      if (editClientId) {
        await axios.put(`http://localhost:5002/api/clients/${editClientId}`, form);
        setSuccess('Cliente actualizado exitosamente.');
      } else {
        await axios.post('http://localhost:5002/api/clients', form);
        setSuccess('Cliente creado exitosamente.');
      }

      setForm({
        cedula: '',
        name: '',
        expedition_date: '',
        expedition_place: '',
        email: '',
        phone: '',
        address: '',
      });
      setEditClientId(null);
      fetchClients();
    } catch (error) {
      setError(error.response?.data?.message || 'Error al enviar el formulario');
    }
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditClientId(client.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/clients/${id}`);
      fetchClients();
      setSuccess('Cliente eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      setError('Error al eliminar cliente.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url(/images/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'rgba(0, 128, 128, 0.6)',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
          padding: '20px',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Gestión de Clientes
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Número de Cédula"
              name="Número de Cédula"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
              required
            />
            <TextField
              label="Nombre del Cliente"
              name="Nombre del Cliente"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
              required
            />
            <TextField
              label="Fecha de Expedición"
              name="Fecha de Expedición"
              variant="outlined"
              type="date"
              fullWidth
              margin="normal"
              value={form.expedition_date}
              onChange={(e) => setForm({ ...form, expedition_date: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <TextField
              label="Lugar de Expedición"
              name="Lugar de Expedición"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.expedition_place}
              onChange={(e) => setForm({ ...form, expedition_place: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <TextField
              label="Correo"
              name="Correo"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <TextField
              label="Teléfono"
              name="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <TextField
              label="Dirección"
              name="Dirección"
              variant="outlined"
              fullWidth
              margin="normal"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              InputProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
            <Button
              type="submit"
              name="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, backgroundColor: '#00796b' }}
            >
              {editClientId ? 'Actualizar Cliente' : 'Crear Cliente'}
            </Button>
          </form>

          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            Lista de Clientes
          </Typography>

          <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#80cbc4' }}>Cédula</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Nombre</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Correo</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Teléfono</TableCell>
                  <TableCell sx={{ color: '#80cbc4' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell sx={{ color: '#fff' }}>{client.cedula}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.email}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{client.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(client)}
                        sx={{ mr: 1, backgroundColor: '#00796b' }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(client.id)}
                        sx={{ backgroundColor: '#d32f2f' }}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default ClientManagement;

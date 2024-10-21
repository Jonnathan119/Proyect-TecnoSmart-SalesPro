import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, TextField, Typography, Alert, MenuItem,
} from '@mui/material';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5002/api/auth/register', {
        email,
        password,
        role,
      });

      setSuccess('Registro exitoso. Redirigiendo a inicio de sesión...');
      setTimeout(() => navigate('/login'), 3000); // Redirigir después de 3 segundos
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar. Intente nuevamente.');
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
          maxWidth: 400,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Registro de Usuario
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            />
            <TextField
              label="Rol"
              select
              variant="outlined"
              fullWidth
              margin="normal"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="user">Usuario</MenuItem>
            </TextField>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, backgroundColor: '#00796b' }}
            >
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, Card, CardContent, TextField, Typography, Alert,
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5002/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      // Guardar el token en localStorage
      localStorage.setItem('token', token);

      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas');
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
            Inicio de Sesión
          </Typography>
          <form onSubmit={handleLogin}>
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
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, backgroundColor: '#00796b' }}
            >
              Iniciar Sesión
            </Button>
          </form>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={() => navigate('/register')}
              variant="text"
              sx={{ color: '#80cbc4' }}
            >
              Crear una cuenta en Tecnosmart:
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={() => navigate('/forgot-password')}
              variant="text"
              sx={{ color: '#80cbc4' }}
            >
              Recuperar contraseña:
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

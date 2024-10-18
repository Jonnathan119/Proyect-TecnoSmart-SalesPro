import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.cedula || !form.name) {
      setError('El número de cédula y el nombre son obligatorios');
      return;
    }

    try {
      if (editClientId) {
        // Actualizar cliente
        await axios.put(`http://localhost:5002/api/clients/${editClientId}`, form);
      } else {
        // Crear nuevo cliente
        await axios.post('http://localhost:5002/api/clients', form);
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
      // Mostrar mensaje de error si la cédula está duplicada u otro error
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
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Clientes</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Número de cédula"
          value={form.cedula}
          onChange={(e) => setForm({ ...form, cedula: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Fecha de expedición"
          value={form.expedition_date}
          onChange={(e) => setForm({ ...form, expedition_date: e.target.value })}
        />
        <input
          type="text"
          placeholder="Lugar de expedición"
          value={form.expedition_place}
          onChange={(e) => setForm({ ...form, expedition_place: e.target.value })}
        />
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">
          {editClientId ? 'Actualizar Cliente' : 'Crear Cliente'}
        </button>
      </form>

      <h3>Lista de Clientes</h3>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.cedula} - {client.name} - {client.email} - {client.phone}
            <button onClick={() => handleEdit(client)}>Editar</button>
            <button onClick={() => handleDelete(client.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientManagement;

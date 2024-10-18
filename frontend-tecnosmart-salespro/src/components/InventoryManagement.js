import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });
  const [editProductId, setEditProductId] = useState(null);

  // Obtener productos al cargar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editProductId) {
        // Actualizar producto
        await axios.put(`http://localhost:5002/api/products/${editProductId}`, form);
      } else {
        // Crear nuevo producto
        await axios.post('http://localhost:5002/api/products', form);
      }

      setForm({ name: '', description: '', price: '', quantity: '', category: '' });
      setEditProductId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  // Editar producto
  const handleEdit = (product) => {
    setForm(product);
    setEditProductId(product.id);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Inventario</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <button type="submit">
          {editProductId ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </form>

      <h3>Lista de Productos</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} - {product.quantity} unidades
            <button onClick={() => handleEdit(product)}>Editar</button>
            <button onClick={() => handleDelete(product.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InventoryManagement;

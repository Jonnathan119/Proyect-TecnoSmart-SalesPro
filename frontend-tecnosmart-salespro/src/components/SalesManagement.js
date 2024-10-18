import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SalesManagement() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [client, setClient] = useState(null);
  const [isCredit, setIsCredit] = useState(false); // Estado para la venta a crédito
  const [error, setError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    fetchClients();
    fetchProducts();
  }, []);

  const fetchClients = async () => {
    const response = await axios.get('http://localhost:5002/api/clients');
    setClients(response.data);
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5002/api/products');
    setProducts(response.data);
  };

  const handleAddProduct = (product, quantity) => {
    const existingProduct = selectedProducts.find((p) => p.id === product.id);
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: quantity } : p
        )
      );
    } else {
      setSelectedProducts([...selectedProducts, { ...product, quantity }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowSummary(true); // Mostrar el resumen antes de confirmar
  };

  const handleConfirmSale = async () => {
    try {
      const saleData = {
        client_id: client,
        products: selectedProducts.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
          price: p.price,
        })),
        is_credit: isCredit, // Incluir si la venta es a crédito
      };
      
      console.log('Datos de la venta enviados:', saleData);

      await axios.post('http://localhost:5002/api/sales', saleData);
      alert('Venta registrada exitosamente');
      setSelectedProducts([]); // Limpiar el formulario después de confirmar
      setShowSummary(false); // Ocultar el resumen después de confirmar
      setIsCredit(false); // Resetear el estado de la venta a crédito
    } catch (error) {
      console.error('Error al registrar la venta:', error.response?.data || error.message);
      // Mostrar mensaje de error si el stock es insuficiente o hay otro error
      setError(error.response?.data?.message || 'Error al registrar la venta');
    }
  };

  const handleCancelSale = () => {
    setShowSummary(false); // Ocultar el resumen y permitir nuevas modificaciones
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  };

  return (
    <div>
      <h2>Registrar Venta</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!showSummary ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Cliente:</label>
            <select onChange={(e) => setClient(e.target.value)} required>
              <option value="">Seleccionar Cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Productos:</label>
            {products.map((product) => (
              <div key={product.id}>
                <span>{product.name} - {product.price}</span>
                <input
                  type="number"
                  placeholder="Cantidad"
                  min="1"
                  max={product.quantity} // Mostrar el stock máximo disponible
                  onChange={(e) =>
                    handleAddProduct(product, parseInt(e.target.value, 10))
                  }
                />
              </div>
            ))}
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={isCredit}
                onChange={(e) => setIsCredit(e.target.checked)}
              />
              Venta a Crédito
            </label>
          </div>

          <button type="submit">Ver Resumen</button>
        </form>
      ) : (
        <div>
          <h3>Resumen de la Venta</h3>
          <ul>
            {selectedProducts.map((product) => (
              <li key={product.id}>
                {product.name} - {product.quantity} unidades - Precio unitario: {product.price} - Total: {product.price * product.quantity}
              </li>
            ))}
          </ul>
          <h4>Total de la venta: {calculateTotal()}</h4>
          <p>{isCredit ? 'Esta venta será registrada como crédito.' : 'Esta venta será al contado.'}</p>
          <button onClick={handleConfirmSale}>Confirmar Venta</button>
          <button onClick={handleCancelSale}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default SalesManagement;

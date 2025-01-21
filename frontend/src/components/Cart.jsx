import { useState, useEffect } from 'react';
import axios from 'axios';

function Cart({ token }) {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (token) {
      const fetchCart = async () => {
        const response = await axios.get('http://localhost:5000/cart/1');
        setCart(response.data);
      };

      fetchCart();
    }
  }, [token]);

  const removeFromCart = async (productId) => {
    await axios.delete(`http://localhost:5000/cart/1/${productId}`);
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) return; // Avoid updating to non-positive quantities
    
    try {
      await axios.put(`http://localhost:5000/cart/1/${productId}`, { quantity: newQuantity });
      setCart(cart.map(item =>
        item.product_id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (error) {
      setNotification({ message: 'Error updating quantity', type: 'error' });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  const checkOut = () => {
    setNotification({ message: 'Sorry, Checkout function is not done yet.', type: 'error' });
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Notification Modal */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}
      <h2 className="text-3xl font-semibold text-center mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-lg text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.product_id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <h3 className="text-xl font-medium">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                    className="mx-2 w-12 text-center border rounded-md"
                  />
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                onClick={() => removeFromCart(item.product_id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <button
          className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition"
          onClick={checkOut}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;

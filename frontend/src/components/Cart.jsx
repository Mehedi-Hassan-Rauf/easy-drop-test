import { useState, useEffect } from 'react';
import axios from 'axios';

function Cart({ token }) {
  const [cart, setCart] = useState([]);

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-lg text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.product_id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <h3 className="text-xl font-medium">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
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
        <button className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;

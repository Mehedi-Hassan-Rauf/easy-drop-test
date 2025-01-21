import { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList({ token }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null); // Track loading state for individual button
  const [notification, setNotification] = useState(null); // Notification state
  const [quantity, setQuantity] = useState({}); // Track selected quantity for each product
  const [cartProductIds, setCartProductIds] = useState(new Set()); // Track product IDs in the cart

  useEffect(() => {
    if(!token){
      setCart([]);
      setCartProductIds(new Set());
    }
    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data);
    };

    const fetchCart = async () => {
      if (!token) return;
      const response = await axios.get('http://localhost:5000/cart', {headers: { Authorization: `Bearer ${token}` },});
      const productIds = response.data.map((item) => item.product_id);
      setCartProductIds(new Set(productIds));
      setCart(response.data);
    };

    fetchProducts();
    fetchCart();
  }, [token]);

const addToCart = async (productId) => {
  if (!token) {
    alert('Please login to add to cart');
    setNotification({ message: 'Please login to add to cart.', type: 'error' });
    setTimeout(() => setNotification(null), 2000);
    return;
  }

  const selectedQuantity = quantity[productId] || 1; // Default to 1 if no quantity is selected

  // Set loading for the button
  setLoadingProductId(productId);

  try {
    // Simulate a delay of 2 seconds before adding to cart
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await axios.post(
      'http://localhost:5000/cart',
      { productId, quantity: selectedQuantity },
      { headers: { Authorization: `Bearer ${token}` } } // Send token in Authorization header
    );

    // Update cart state
    setCart([...cart, response.data]);
    setCartProductIds(new Set([...cartProductIds, productId])); // Update cart product IDs

    // Show success notification
    setNotification({ message: `Product has been added to your cart!`, type: 'success' });

    // Hide notification after 3 seconds
    setTimeout(() => setNotification(null), 2000);
  } catch (error) {
    // Show error notification
    const errorMessage =
      error.response?.data?.message || 'Failed to add product to cart. Please try again later.';
    setNotification({ message: errorMessage, type: 'error' });

    setTimeout(() => setNotification(null), 2000);
  } finally {
    // Reset loading state
    setLoadingProductId(null);
  }
};


  const handleQuantityChange = (productId, value) => {
    if (value >= 1) {
      setQuantity((prev) => ({ ...prev, [productId]: value }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Notification Modal */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          ?.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
          .map((product) => (
            <div
              key={product.id}
              className="p-4 border border-gray-200 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">${product.price}</p>

              {/* Quantity input */}
              <div className="mb-4 flex items-center space-x-2">
                <label htmlFor={`quantity-${product.id}`} className="text-sm text-gray-600">Quantity:</label>
                <input
                  id={`quantity-${product.id}`}
                  type="number"
                  min="1"
                  value={quantity[product.id] || 1}
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                  className="w-16 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => addToCart(product.id)}
                className={`${cartProductIds.has(product.id) ? "border border-blue-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"} px-4 py-2 rounded transition ${loadingProductId === product.id ? 'cursor-wait opacity-50' : ''}`}
                disabled={loadingProductId === product.id || cartProductIds.has(product.id)} // Disable button when loading or already in cart
              >
                {cartProductIds.has(product.id) ? 'Added' : loadingProductId === product.id ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductList;

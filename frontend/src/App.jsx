import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useLocation } from 'react-router-dom';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token')); // Check localStorage on initial load

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove token on logout
  };

  return (
      <div className="min-h-screen h-screen bg-gray-100 flex flex-col">
        <nav className="bg-blue-600 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white text-lg font-semibold hover:text-gray-200">Home</Link>
              <Link to="/cart" className="text-white text-lg font-semibold hover:text-gray-200">Cart</Link>
            </div>
            <div>
              {token ? (
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${location.pathname === "/login" ? "hidden" : ""}`}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow container mx-auto py-8">
          <Routes>
            <Route path="/" element={<ProductList token={token} />} />
            <Route path="/login" element={token ? <Navigate to="/"/> : <Login setToken={setToken} />} />
            <Route path="/signup" element={token ? <Navigate to="/"/> : <SignUp setToken={setToken} />} />
            <Route path="/cart" element={token ? <Cart token={token} /> : <Navigate to="/login"/>} token={token} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-auto">
          <p>© Rauf Ltd. All rights reserved.</p>
        </footer>
      </div>
  );
}

export default App;

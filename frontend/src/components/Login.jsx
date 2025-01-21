import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null); // Notification state

  // Check if token exists in localStorage on page load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken); // If a token exists, set it
    }
  }, [setToken]);

  const login = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      const token = response.data.token;
      setToken(token); // Set token in the parent component's state
      localStorage.setItem('token', token); // Store token in localStorage
      setNotification({ message: 'Login successful.', type: 'success' });
      setTimeout(() => setNotification(null), 2000);
    } catch (error) {
      setNotification({ message: 'Invalid credentials.', type: 'error' });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  return (
    <div className="flex items-center h-full justify-center bg-gray-100">
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {notification.message}
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={login}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <Link to="/signup" className="text-blue-500 hover:text-blue-700"> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from 'react';
import axios from 'axios';

function SignUp({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState(null); // Notification state

  const signUp = async () => {
    if (password !== confirmPassword) {
      setNotification({ message: 'Passwords do not match.', type: 'error' });
      setTimeout(() => setNotification(null), 2000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      const token = response.data.token;
      setToken(token); // Set token in the parent component's state
      localStorage.setItem('token', token); // Store token in localStorage
      setNotification({ message: 'Sign up successful.', type: 'success' });
      setTimeout(() => setNotification(null), 2000);
    } catch (error) {
      setNotification({ message: 'Error signing up.', type: 'error' });
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
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Sign Up</h2>
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
        <div className="mb-4">
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
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={signUp}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignUp;

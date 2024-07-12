import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Username = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/registerUsername', { username }, { withCredentials: true });
      navigate('/'); // Redirect to the main screen after successful registration
    } catch (err) {
      setError(err.response.data.message || 'Error registering username');
    }
  };

  return (
    <div>
      <h2>Register Username</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUsernameSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Username;

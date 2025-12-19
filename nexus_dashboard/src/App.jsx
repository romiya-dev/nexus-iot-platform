import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const App = () => {
  // Check if token exists in browser memory
  const [token, setToken] = useState(localStorage.getItem('nexus_token'));

  const handleLogin = (newToken) => {
    // Save token to memory so refresh works
    localStorage.setItem('nexus_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_token');
    setToken(null);
  };

  // Simple Routing: If no token, show Login. If token, show Dashboard.
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Optional: Add a logout button overlay */}
      <button 
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '8px 16px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        Logout
      </button>
      
      <Dashboard />
    </div>
  );
};

export default App;
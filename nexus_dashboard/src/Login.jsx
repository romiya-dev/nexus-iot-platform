import React, { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Send credentials to Django
      const response = await fetch('http://127.0.0.1:8001/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      // 2. Check if valid
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      // 3. Get the token
      const data = await response.json();
      
      // 4. Pass token up to App component
      onLogin(data.access);
      
    } catch (err) {
      setError('Login failed. Please check your username/password.');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f3f4f6' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#111827', margin: 0 }}>Nexus IoT Login</h2>
          <p style={{ color: '#6b7280', marginTop: '5px' }}>Secure Industrial Platform</p>
        </div>

        {error && (
          <div style={{ 
            background: '#fee2e2', color: '#991b1b', 
            padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Username</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px' }}>
              <User size={18} color="#9ca3af" style={{ marginRight: '10px' }} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                placeholder="Enter admin"
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d1d5db', borderRadius: '8px', padding: '10px' }}>
              <Lock size={18} color="#9ca3af" style={{ marginRight: '10px' }} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '16px' }}
                placeholder="Enter password"
              />
            </div>
          </div>

          <button type="submit" style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}>
            Sign In <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
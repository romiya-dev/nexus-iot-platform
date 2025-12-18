import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, Wifi, WifiOff } from 'lucide-react';

const App = () => {
  const [data, setData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [latestTemp, setLatestTemp] = useState(0);
  
  // Use a Ref to store the WebSocket so it persists between renders
  const ws = useRef(null);

  useEffect(() => {
    // 1. Connect to FastAPI WebSocket
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log("Connected to Nexus IoT");
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      // Update the latest temperature card
      setLatestTemp(message.temperature);

      // Add new data point to the graph (Keep only last 20 points)
      setData(prevData => {
        const newData = [...prevData, {
          time: new Date().toLocaleTimeString(),
          temp: message.temperature
        }];
        return newData.slice(-20); // Keep graph clean
      });
    };

    // Cleanup when the component closes
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#111827', fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={28} color="#2563eb" /> Nexus Industrial Monitor
        </h1>
        <div style={{ 
          padding: '8px 16px', 
          borderRadius: '20px', 
          backgroundColor: isConnected ? '#d1fae5' : '#fee2e2',
          color: isConnected ? '#065f46' : '#991b1b',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
          {isConnected ? "System Online" : "Disconnected"}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Live Temperature</div>
          <div style={{ fontSize: '36px', fontWeight: 'bold', color: latestTemp > 80 ? '#ef4444' : '#10b981' }}>
            {latestTemp.toFixed(1)}°C
          </div>
        </div>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Device Status</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>Active</div>
        </div>
      </div>

      {/* Live Chart */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: '400px' }}>
        <h3 style={{ marginBottom: '20px', color: '#374151' }}>Real-Time Temperature Stream</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#2563eb' }} 
              activeDot={{ r: 8 }} 
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default App;
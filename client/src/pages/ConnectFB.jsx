import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export default function ConnectFB() {
  const [connected, setConnected] = useState(false);
  const [pageName, setPageName] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const checkConnection = async () => {
    try {
      const res = await axios.get(`${API_URL}/fb/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.connected) {
        setConnected(true);
        setPageName(res.data.pageName);
      } else {
        setConnected(false);
        setPageName('');
      }
    } catch (err) {
      console.error('Error checking connection:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleConnect = () => {
    if (!token) {
      alert("Please log in first!");
      return navigate('/');
    }

    // Redirect to server-side FB OAuth
    window.location.href = `${API_URL}/fb/connect?token=${token}`;
  };

  const handleDisconnect = async () => {
  const token = localStorage.getItem('token'); // ✅ Get token inside the function
  try {
    const res = await axios.delete(`${API_URL}/fb/disconnect`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      setConnected(false);
      setPageName('');
      alert("Disconnected successfully.");
    } else {
      console.warn("Unexpected response:", res);
    }
  } catch (err) {
    console.error("Error disconnecting:", err.response?.data || err.message);
    alert("Failed to disconnect the page.");
  }
};


  const goToMessages = () => {
    navigate('/dashboard');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden">
  <div
    className="bg-white p-8 rounded-xl shadow-2xl w-96 text-center transform transition-all duration-500 hover:rotate-1 hover:scale-105 animate-float"
    style={{
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
    }}
  >
    <h2 className="text-2xl font-bold mb-6 text-blue-700">Facebook Page Integration</h2>

    {connected ? (
      <>
        <p className="mb-4">
          Integrated Page: <strong className="text-indigo-700">{pageName}</strong>
        </p>
        <button
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mb-3 w-full transition"
        >
          Delete Integration
        </button>
        <button
          onClick={goToMessages}
          className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition"
        >
          Reply To Messages
        </button>
      </>
    ) : (
      <button
        onClick={handleConnect}
        className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition"
      >
        Connect Page
      </button>
    )}
  </div>

  {/* Floating Animation */}
  <style>{`
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
    .animate-float {
      animation: float 4s ease-in-out infinite;
    }
  `}</style>
</div>

  );
}

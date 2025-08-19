import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/api';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
            <Login onLogin={handleLogin} /> : 
            <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
            <Register onRegister={handleRegister} /> : 
            <Navigate to="/dashboard" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;

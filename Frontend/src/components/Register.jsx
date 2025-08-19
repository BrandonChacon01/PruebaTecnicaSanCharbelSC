import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData.username, formData.password);
      
      // Después de registrar exitosamente, hacer login automáticamente
      const loginResponse = await authService.login(formData.username, formData.password);
      
      if (loginResponse.token) {
        authService.saveToken(loginResponse.token);
        authService.saveUser({ username: formData.username });
        onRegister();
      }
    } catch (error) {
      console.error('Error de registro:', error);
      setError(error.response?.data?.message || 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Crear Cuenta</h1>
          <p>Completa los datos para registrarte</p>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary auth-button"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta?{' '}
            <button 
              type="button" 
              className="link-button"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

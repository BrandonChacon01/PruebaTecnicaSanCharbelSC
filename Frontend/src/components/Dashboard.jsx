import { useState, useEffect } from 'react';
import { newsService, authService } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = authService.getUser();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await newsService.getTechNews();
      setNews(data.results || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Error al cargar las noticias. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="navbar-brand">
              <h2>Noticias</h2>
            </div>
            <div className="navbar-user">
              <span>Bienvenido, <strong>{user?.username || 'Usuario'}</strong></span>
              <button onClick={handleLogout} className="btn-secondary logout-btn">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <h1>Últimas Noticias de Tecnología</h1>
            <p>Mantente al día con las últimas noticias del mundo tecnológico</p>
            <button 
              onClick={fetchNews} 
              className="btn-primary refresh-btn"
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Actualizar Noticias'}
            </button>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando noticias...</p>
            </div>
          ) : (
            <div className="news-grid">
              {news.length > 0 ? (
                news.map((article, index) => (
                  <article key={index} className="news-card">
                    <div className="news-header">
                      <h3 className="news-title">{article.title}</h3>
                      <span className="news-date">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    
                    <div className="news-content">
                      <p className="news-description">
                        {article.description || 'Descripción no disponible'}
                      </p>
                      
                      {article.url && (
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="news-link"
                        >
                          Leer más →
                        </a>
                      )}
                    </div>

                    <div className="news-footer">
                      <span className="news-source">
                        📡 {article.source?.name || 'BBC Technology'}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-news">
                  <h3>No hay noticias disponibles</h3>
                  <p>Intenta actualizar las noticias más tarde.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import './App.css'; // Asegúrate de tener este archivo con los estilos

function App() {
  // Estados de la aplicación
  const [activeTab, setActiveTab] = useState('current'); // Controla qué pestaña está activa
  const [catFact, setCatFact] = useState(''); // Almacena el hecho de gato actual
  const [gifUrl, setGifUrl] = useState(''); // Almacena la URL del GIF actual
  const [history, setHistory] = useState([]); // Almacena el historial de búsquedas
  const [isLoading, setIsLoading] = useState(false); // Controla el estado de carga
  const [error, setError] = useState(null); // Almacena mensajes de error

  // URL base de tu API .NET (debería estar en variables de entorno)
  const API_BASE_URL = 'http://localhost:5210/api'; // Cambia esto por tu URL real

  /**
   * Efecto que se ejecuta al cargar el componente y cuando cambia activeTab
   * - Carga un hecho de gato al inicio
   * - Carga el historial cuando se activa esa pestaña
   */
  useEffect(() => {
    if (activeTab === 'current') {
      fetchCatFact();
    } else {
      fetchHistory();
    }
  }, [activeTab]);

  /**
   * Obtiene un hecho aleatorio de gato desde tu API .NET
   * Luego busca un GIF relacionado con las primeras palabras del hecho
   */
  const fetchCatFact = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Obtener el hecho de gato
      const factResponse = await fetch(`${API_BASE_URL}/fact`);
      if (!factResponse.ok) throw new Error('Error al obtener el hecho de gato');
      
      const factData = await factResponse.json();
      setCatFact(factData.fact);
      
      // 2. Obtener GIF relacionado
      if (factData.fact) {
        const query = factData.fact.split(' ').slice(0, 3).join(' ');
        await fetchGif(query);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Busca un GIF en tu API .NET usando un término de búsqueda
   * @param {string} query - Término de búsqueda para el GIF
   */
  const fetchGif = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/gif?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Error al obtener el GIF');
      
      const data = await response.json();
      setGifUrl(data.Url);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene el historial de búsquedas desde tu API .NET
   */
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      if (!response.ok) throw new Error('Error al obtener el historial');
      
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza solo el GIF manteniendo el mismo hecho de gato
   */
  const handleRefreshGif = async () => {
    if (!catFact) return;
    const query = catFact.split(' ').slice(0, 3).join(' ');
    await fetchGif(query);
  };

  /**
   * Actualiza tanto el hecho de gato como el GIF
   */
  const handleRefreshAll = async () => {
    await fetchCatFact();
  };

  return (
    <div className="app">
      {/* Navegación por pestañas */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Resultado actual
        </button>
        <button 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historial de búsquedas
        </button>
      </div>

      {/* Mensaje de error (si existe) */}
      {error && <div className="error">{error}</div>}

      {/* Contenido de la pestaña actual */}
      {activeTab === 'current' && (
        <div className="current-result">
          <div className="content">
            {gifUrl && (
              <div className="gif-container">
                <img src={gifUrl} alt="Random cat related GIF" />
              </div>
            )}
            <div className="text-container">
              <p>{catFact || 'Cargando dato de Cat Fact...'}</p>
            </div>
          </div>
          <div className="buttons">
            <button onClick={handleRefreshGif} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Refrescar GIF'}
            </button>
            <button onClick={handleRefreshAll} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Refrescar Todo'}
            </button>
          </div>
        </div>
      )}

      {/* Contenido de la pestaña de historial */}
      {activeTab === 'history' && (
        <div className="history">
          <table>
            <thead>
              <tr>
                <th>Fecha de búsqueda</th>
                <th>Texto completo</th>
                <th>Palabras de búsqueda</th>
                <th>URL del GIF</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.searchDate).toLocaleString()}</td>
                    <td>{entry.fact}</td>
                    <td>{entry.query}</td>
                    <td>
                      {entry.gifUrl ? (
                        <a href={entry.gifUrl} target="_blank" rel="noopener noreferrer">
                          Ver GIF
                        </a>
                      ) : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay historial aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
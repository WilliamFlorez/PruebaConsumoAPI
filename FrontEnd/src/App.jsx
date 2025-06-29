import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Estados
  const [activeTab, setActiveTab] = useState('current');
  const [catFact, setCatFact] = useState('');
  const [gifUrl, setGifUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);  //Variables para Paginación
    const [itemsPerPage] = useState(10); // 10 elementos por página
    // Calcula los índices de los elementos a mostrar
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

        // Calcula el número total de páginas
          const totalPages = Math.ceil(history.length / itemsPerPage);

          
  const [error, setError] = useState(null);
      useEffect(() => {// temporizador de mensaje de error
          if (error) {
            const timer = setTimeout(() => {setError(null);}, 1000); // 1 segundos
            return () => clearTimeout(timer);
          }
        }, [error]); // Se ejecuta cada vez que 'error' cambia


  // Configuración de Axios
  const API_BASE_URL = 'http://localhost:5210/api';
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Efecto para cargar datos al iniciar y al cambiar pestaña
  useEffect(() => {
    if (activeTab === 'current') {
      fetchCatFact();
    } else {
      fetchHistory();
    }
  }, [activeTab]);

  // Obtener un hecho de gato
  const fetchCatFact = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/fact');
      setCatFact(response.data.fact);
      
      if (response.data.fact) {
        const query = response.data.fact.split(' ').slice(0, 3).join(' ');
        await fetchGif(query, response.data.fact);
      }
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar GIF (POST con body)
  const fetchGif = async (query, fullFact) => {
      setIsLoading(true);
      setError(null);
                  //console.log("3 palabras "+query)
      try {
        // informacion enviada al api 
          const response = await api.post('/gif', { 
            Query: query,
            Fact: fullFact || catFact
          });

            console.log("Respuesta completa:", response.data.url);
            //console.log("URL de la API de Giphy:", response.GiphyApiUrl);

           

          setGifUrl(response.data.url);
            console.log("Respuesta completa:", response);


          } catch (error) {
          setError(error.response?.data || error.message);
      } finally {
          setIsLoading(false);
      }
  };

  // Obtener historial
  const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/history');
        setHistory(response.data);
      } catch (error) {
        setError(error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
  };

  // eliminar echo de los gatos
  const Eliminar = async (id) => {
    console.log(id);
       try {
            setIsLoading(true);
            setError(null);
                    console.log(`Enviando DELETE a: ${API_BASE_URL}/history/delete`);

            const response = await api.delete('/history/delete',{
                data : {id:id}   // se envia el id del mensaje por el body
            });
                console.log(response);
                console.log('Respuesta del servidor:', response.data);

              //Actualizar la lista del historial
            setHistory( history.filter( mensaje => mensaje.id !== id));
            //alert('Eliminado exitosamente');
          setError("Eliminado Exitosamente");

        } catch (error) {
             setError(error.response?.data || error.message);
             console.log("ERROR|| ".error);
        } finally {
            setIsLoading(false);
        }
      
  };

  // Manejar refrescos
  const handleRefreshGif = async () => {
      if (!catFact) return;
      const query = catFact.split(' ').slice(0, 3).join(' ');
      await fetchGif(query, catFact);
  };

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

      {/* Mensaje de error */}
      {error && <div className="error">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}

      {/* Contenido de pestaña actual */}
      {activeTab === 'current' && (
        <div className="current-result">


            <table>
              <thead>
                  <tr>
                      <th>Texto</th>
                      <th>Imagen</th>
                  </tr>
              </thead>

            <tbody>  
                  <tr>
                      <td>
                          <div className="text-container">
                              <p>{catFact || 'Cargando dato de Cat Fact...'}</p>
                          </div>
                      </td>
                      <td>              
                        {/*MOSTRAR IMAGEN*/}
                            {gifUrl ? (
                                      <img 
                                        src={gifUrl} 
                                        alt="GIF relacionado" 
                                        style={{ width: '500px', height: '500px', objectFit: 'cover' }}
                                      />
                                    ) : (
                                      <p>No hay imagen disponible</p>
                                    )}
                      </td>
                  </tr>
              </tbody>  
            </table>


           
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

      {/* Contenido de pestaña historial */}
      {activeTab === 'history' && (
        <div className="history">  
          <table>
            <thead>
              <tr>
                <th>Fecha de búsqueda</th>
                <th>Texto completo</th>
                <th>Palabras de búsqueda</th>
                <th>Edición</th>
                <th>URL del GIF</th>
              </tr>
            </thead>
            <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((entry, index) => (
                      <tr key={index}>
                        <td>{new Date(entry.searchDate).toLocaleString()}</td>
                        <td>{entry.fact}</td>
                        <td>{entry.query}</td>
                        <td><button onClick={() => Eliminar(entry.id)} value={entry.id}>ELIMINAR</button></td>
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
                      <td colSpan="5">No hay historial aún</td>
                    </tr>
                  )}
            </tbody>
          </table>


              {/* Componente de paginación */}
                  {history.length > itemsPerPage && (
                    <div className="pagination">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </button>
                      
                      <span>Página {currentPage} de {totalPages}</span>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Siguiente
                      </button>
                    </div>
                  )}

          
        </div>
      )}
    </div>
  );
}

export default App;
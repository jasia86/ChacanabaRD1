import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/test');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Sastrería Premium - Gestión de Chacabanas
        </h1>
        <p className="text-center text-muted-foreground">
          Sistema profesional para gestionar pedidos de chacabanas personalizadas
        </p>
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Backend Connection Test</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {data && (
            <div>
              <p className="text-green-500">Successfully connected to the backend!</p>
              <pre className="mt-2 p-2 bg-gray-100 rounded">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
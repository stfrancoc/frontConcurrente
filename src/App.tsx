import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { VerificationForm } from './components/VerificationForm';
import { GeneSearch } from './components/GeneSearch';
import { GeneResult } from './types';
import { AuthState } from './types/auth';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: '',
    isVerified: false,
    username: '',
  });
  const [showRegister, setShowRegister] = useState(false);
  const [searchResults, setSearchResults] = useState<GeneResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [showVerification, setShowVerification] = useState(false);

  // Función para cerrar sesión
  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      token: '',
      isVerified: false,
      username: '',
    });
    setShowVerification(false);
    setShowRegister(false);
    alert('Has cerrado sesión exitosamente.');
  };

  // Verificar usuario con código de seguridad
  const handleVerify = async (email: string, securityKey: string) => {
    if (!email || !securityKey) {
      alert('Por favor, proporciona todos los datos necesarios.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/verify-security-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, security_key: securityKey }),
      });

      console.log(JSON.stringify({ email, security_key: securityKey }));
      if (response.ok) {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isVerified: true,
        }));
        alert('Verificación exitosa.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al verificar el código.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  // Manejar inicio de sesión
  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      alert('Por favor, proporciona tu usuario y contraseña.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState((prev) => ({
          ...prev,
          token: data.access_token,
          isAuthenticated: true,
          isVerified: false,
          username,
        }));
        setShowVerification(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al iniciar sesión.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  // Manejar registro de usuario
  const handleRegister = async (username: string, password: string) => {
    if (!username || !password) {
      alert('Por favor, proporciona un usuario y contraseña.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setShowRegister(false);
        alert('Registro exitoso. Por favor, inicie sesión.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al registrar usuario.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  // Subir archivo
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authState.token}` },
        body: formData,
      });

      if (response.ok) {
        alert('Archivo subido exitosamente.');
      } else {
        alert('Error al subir el archivo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  // Buscar genes
  const handleSearch = async (query: string, page: number, resultsPerPage: number,fileName: string) => {
    if (!query) {
      alert('Por favor, ingresa un término de búsqueda.');
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/search/?search=${query}&page=${page}&per_page=${resultsPerPage}&collection_name=${fileName}`,
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setTotalResults(data.total_results);
        setCurrentPage(data.page);
        setPerPage(data.per_page);
      } else {
        alert('Error al buscar genes.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  // Renderizar contenido basado en estado de autenticación
  const renderAuthContent = () => {
    if (!authState.isAuthenticated) {
      return showVerification ? (
        <VerificationForm
          onVerify={(code) => handleVerify(authState.username, code)}
        />
      ) : showRegister ? (
        <RegisterForm
          onRegister={handleRegister}
          onBackToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm
          onLogin={handleLogin}
          onRegisterClick={() => setShowRegister(true)}
        />
      );
    }

    if (!authState.isVerified) {
      return (
        <VerificationForm
          onVerify={(code) => handleVerify(authState.username, code)}
        />
      );
    }

    return (
      <div>
        <button
          onClick={handleLogout}
          className="mb-4 p-2 bg-red-500 text-white rounded"
        >
          Cerrar sesión
        </button>
        <GeneSearch
          onFileUpload={handleFileUpload}
          onSearch={handleSearch}
          results={searchResults}
          totalResults={totalResults}
          currentPage={currentPage}
          perPage={perPage}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {renderAuthContent()}
    </div>
  );
}

export default App;

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
    isVerified: false
  });
  const [showRegister, setShowRegister] = useState(false);
  const [searchResults, setSearchResults] = useState<GeneResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  const handleVerify = async (code: string) => {
    try {
      if (code === "123456") {
        setAuthState(prev => ({ ...prev, isVerified: true }));
      } else {
        alert('Código de verificación inválido');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al verificar el código');
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState(prev => ({
          ...prev,
          token: data.access_token,
          isAuthenticated: true
        }));
      } else {
        alert('Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/users/simple-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setShowRegister(false);
        alert('Registro exitoso. Por favor inicie sesión.');
      } else {
        alert('Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/upload/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Archivo subido exitosamente');
      } else {
        alert('Error al subir el archivo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleSearch = async (query: string, page: number, resultsPerPage: number) => {
    try {
      const response = await fetch(
        `${API_URL}/search/?search=${query}&page=${page}&per_page=${resultsPerPage}`,
        {
          headers: {
            'Authorization': `Bearer ${authState.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setTotalResults(data.total_results);
        setCurrentPage(data.page);
        setPerPage(data.per_page);
      } else {
        alert('Error al buscar genes');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const renderAuthContent = () => {
    if (!authState.isAuthenticated) {
      return showRegister ? (
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
      return <VerificationForm onVerify={handleVerify} />;
    }

    return (
      <GeneSearch
        onFileUpload={handleFileUpload}
        onSearch={handleSearch}
        results={searchResults}
        totalResults={totalResults}
        currentPage={currentPage}
        perPage={perPage}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {renderAuthContent()}
    </div>
  );
}

export default App;
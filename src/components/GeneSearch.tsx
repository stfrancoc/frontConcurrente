import React, { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import { GeneResult } from '../types';
import { GeneTable } from './GeneTable';

interface GeneSearchProps {
  onFileUpload: (file: File) => Promise<void>;
  onSearch: (query: string, page: number, perPage: number) => Promise<void>;
  results: GeneResult[];
  totalResults: number;
  currentPage: number;
  perPage: number;
}

export function GeneSearch({ 
  onFileUpload, 
  onSearch, 
  results = [], // Provide default empty array
  totalResults, 
  currentPage, 
  perPage 
}: GeneSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      await onFileUpload(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleSearch = () => {
    onSearch(searchQuery, currentPage, perPage);
  };

  const totalPages = Math.ceil(totalResults / perPage);

  return (
    <div className="w-full max-w-7xl space-y-6 p-4">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="w-5 h-5" />
            {selectedFile ? selectedFile.name : 'Seleccionar Archivo'}
          </label>
        </div>
        {selectedFile && (
          <button
            onClick={handleFileUpload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Subir Archivo
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar genes..."
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Search className="w-5 h-5" />
          Buscar
        </button>
      </div>

      <GeneTable results={results} />

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Mostrando {results.length} de {totalResults} resultados
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSearch(searchQuery, currentPage - 1, perPage)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => onSearch(searchQuery, currentPage + 1, perPage)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
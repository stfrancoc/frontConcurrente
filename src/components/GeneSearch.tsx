import React, { useState, useEffect } from 'react';
import { Search, Upload } from 'lucide-react';
import { GeneResult, UploadedFile } from '../types';
import { GeneTable } from './GeneTable';
import { FileSelector } from './FileSelector';

interface GeneSearchProps {
  onFileUpload: (file: File) => Promise<void>;
  onSearch: (query: string, page: number, perPage: number, fileName: string) => Promise<void>;
  results: GeneResult[];
  totalResults: number;
  currentPage: number;
  perPage: number;
}

const API_URL = 'http://127.0.0.1:8000';

export function GeneSearch({
  onFileUpload,
  onSearch,
  results = [],
  totalResults,
  currentPage,
  perPage
}: GeneSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [pageCounter, setPageCounter] = useState(currentPage);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/upload/uploaded-files`);
      if (response.ok) {
        const fileNames: string[] = await response.json();
        // Transformar los nombres en objetos UploadedFile
        const files: UploadedFile[] = fileNames.map((fileName) => ({
          name: fileName,
          path: `${API_URL}/uploads/${fileName}`, // Construye el path según sea necesario
        }));
        setUploadedFiles(files);
      } else {
        console.error('Error al obtener los archivos:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      await onFileUpload(selectedFile);
      setSelectedFile(null);
      // Actualizar la lista de archivos después de subir uno nuevo
      fetchUploadedFiles();
    }
  };

  const handleSearch = () => {
    if (!selectedFileName) {
      alert('Por favor seleccione un archivo para buscar');
      return;
    }
    onSearch(searchQuery, pageCounter, perPage, selectedFileName);
  };

  const handlePageChange = (newPage: number) => {
    setPageCounter(newPage);
    onSearch(searchQuery, newPage, perPage, selectedFileName);
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

      <FileSelector
        files={uploadedFiles}
        selectedFile={selectedFileName}
        onFileSelect={setSelectedFileName}
      />

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
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handlePageChange(pageCounter - 1)}
            disabled={pageCounter === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            Página {pageCounter} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pageCounter + 1)}
            className="px-3 py-1 border rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { FileDown } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileSelectorProps {
    files: UploadedFile[];
    selectedFile: string;
    onFileSelect: (fileName: string) => void;
}

export function FileSelector({ files, selectedFile, onFileSelect }: FileSelectorProps) {
    { console.log(files) }
    return (
        <div className="flex items-center gap-2 mb-4">
            <FileDown className="w-5 h-5 text-blue-600" />
            <select
                value={selectedFile}
                onChange={(e) => onFileSelect(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
                <option value="">Seleccionar archivo</option>
                {files.map((file) => (
                    <option key={file.name} value={file.name}>
                        {file.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
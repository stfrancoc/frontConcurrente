import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

interface VerificationFormProps {
  onVerify: (code: string) => Promise<void>;
}

export function VerificationForm({ onVerify }: VerificationFormProps) {
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onVerify(code);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-center mb-6">
        <KeyRound className="w-12 h-12 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">Verificación</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Código de Verificación
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Verificar
        </button>
      </form>
    </div>
  );
}
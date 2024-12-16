import React from 'react';
import { GeneResult } from '../types';

interface GeneTableProps {
  results: GeneResult[];
}

export function GeneTable({ results }: GeneTableProps) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay resultados para mostrar
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chromosome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alternate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quality
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Filter Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Format
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Outputs
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {results.map((gene, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{gene.chromosome}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.position}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.reference}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.alternate}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.quality}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.filter_status}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.info}</td>
              <td className="px-6 py-4 whitespace-nowrap">{gene.format}</td>
              <td className="px-6 py-4">
                <details className="cursor-pointer">
                  <summary className="text-blue-600 hover:text-blue-800">
                    Ver outputs
                  </summary>
                  <div className="mt-2 space-y-1 text-sm">
                    {Object.entries(gene.outputs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2">
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
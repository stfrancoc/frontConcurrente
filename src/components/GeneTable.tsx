import React, { useState, useMemo } from 'react';
import { GeneResult } from '../types';
import { TableHeader } from './TableHeader';

interface GeneTableProps {
  results: GeneResult[];
}

type SortDirection = 'asc' | 'desc' | null;

export function GeneTable({ results }: GeneTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Move this outside of the conditional
  const outputKeys = useMemo(() => {
    return results[0] ? Object.keys(results[0].outputs).sort() : [];
  }, [results]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedResults = useMemo(() => {
    if (!sortKey || !sortDirection) return results;

    return [...results].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Check if we're sorting an output field
      if (sortKey.startsWith('output_')) {
        aValue = a.outputs[sortKey];
        bValue = b.outputs[sortKey];
      } else {
        aValue = a[sortKey as keyof GeneResult];
        bValue = b[sortKey as keyof GeneResult];
      }

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string values
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [results, sortKey, sortDirection]);

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
            <TableHeader
              label="Chromosome"
              sortKey="chromosome"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Position"
              sortKey="position"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="ID"
              sortKey="id"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Reference"
              sortKey="reference"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Alternate"
              sortKey="alternate"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Quality"
              sortKey="quality"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Filter Status"
              sortKey="filter_status"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Info"
              sortKey="info"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            <TableHeader
              label="Format"
              sortKey="format"
              currentSort={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            {outputKeys.map((key) => (
              <TableHeader
                key={key}
                label={key}
                sortKey={key}
                currentSort={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedResults.map((gene, index) => (
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
              {outputKeys.map((key) => (
                <td key={key} className="px-6 py-4 whitespace-nowrap">
                  {gene.outputs[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
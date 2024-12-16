import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (key: string) => void;
}

export function TableHeader({ 
  label, 
  sortKey, 
  currentSort, 
  sortDirection, 
  onSort 
}: TableHeaderProps) {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown 
          className={`w-4 h-4 ${currentSort === sortKey ? 'text-blue-600' : 'text-gray-400'} ${
            sortDirection === 'desc' ? 'transform rotate-180' : ''
          }`}
        />
      </div>
    </th>
  );
}
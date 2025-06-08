"use client";
import { useState } from "react";
import { SummaryData } from "../page";

export function CategoryTable({ meter_category_totals }: SummaryData) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'meter_category' | 'total' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  function handleSort(field: 'meter_category' | 'total') {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  }

  const filtered = meter_category_totals
    ?.filter((cat) =>
      cat.meter_category.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasData = meter_category_totals?.length > 0;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Gastos por Categoria</h2>
      <input
        type="text"
        placeholder="Buscar categoria..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full md:w-1/3 p-2 border border-gray-300 rounded"
      />

      <table className="w-full text-sm text-left border rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th
              className="p-2 cursor-pointer select-none"
              onClick={() => handleSort('meter_category')}
            >
              Categoria ↑↓
            </th>
            <th
              className="p-2 text-right cursor-pointer select-none"
              onClick={() => handleSort('total')}
            >
              Total (R$) ↑↓
            </th>
          </tr>
        </thead>
        <tbody>
          {!hasData || paginated.length === 0 ? (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                Nenhuma categoria encontrada.
              </td>
            </tr>
          ) : (
            paginated.map((cat) => (
              <tr key={cat.meter_category} className="border-t">
                <td className="p-2">{cat.meter_category}</td>
                <td className="p-2 text-right">
                  {cat.total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
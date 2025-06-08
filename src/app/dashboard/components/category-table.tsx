"use client";
import { useState } from "react";
import { SummaryData } from "../page";

export function CategoryTable(data: SummaryData | null) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemPerPage = 10

  const hasMeterCategories = data && data.meter_category_totals.length > 0

  const filterCategories = data?.meter_category_totals
    .filter((cat) => cat.meter_category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.total - a.total)

  const totalPages = Math.ceil((filterCategories?.length ?? 0) / itemPerPage)
  const paginatedCategories = filterCategories?.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  ) ?? []

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
            <th className="p-2">Categoria</th>
            <th className="p-2 text-right">Total (R$)</th>
          </tr>
        </thead>
        <tbody>
          {!hasMeterCategories && (
            <tr>
              <td colSpan={2} className="p-4 text-center text-gray-500">
                Nenhuma categoria encontrada.
              </td>
            </tr>
          )}
          {paginatedCategories
            .filter((cat) =>
              cat.meter_category.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => b.total - a.total)
            .map((cat) => (
              <tr key={cat.meter_category} className="border-t">
                <td className="p-2">{cat.meter_category}</td>
                <td className="p-2 text-right">
                  {cat.total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Página {currentPage} de {totalPages}
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
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}
'use client'

import { createApi } from "@/services/axios-service";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from 'react'

type Invoice = {
  id: string
  partner_id: string
  customer_id: string
  exchange_rate: number
  exchange_rate_date: string
  charge_start_date: string
  charge_end_date: string
  customer: {
    id: string
    name: string
    domain: string
    country: string
  }
  partner: {
    ID: string
    Name: string
    MpnID: number
    Tier2MpnID: number
  }
}

type ApiResponse = {
  data: Invoice[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  status: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getInvoices = useCallback(async () => {
    const token = Cookies.get("_token_")
    const api = createApi(token);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: '10',
    })
    if (search) params.append('customer_id', search)

      try {
      const res = await api.get(`/api/invoices?${params.toString()}`)
      const data: ApiResponse = res.data
      setInvoices(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }, [page, search])

  useEffect(() => {
    getInvoices()
  }, [getInvoices])

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Notas Fiscais</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por id do cliente..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="p-2 border rounded w-full md:w-1/3"
        />
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">Cliente</th>
            <th className="text-left p-2">ID Cliente</th>
            <th className="text-left p-2">Domínio</th>
            <th className="text-left p-2">Parceiro</th>
            <th className="text-left p-2">Início</th>
            <th className="text-left p-2">Fim</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? invoices.map((inv) => (
            <tr key={inv.id} className="border-t">
              <td className="p-2">{inv.id}</td>
              <td className="p-2">{inv.customer.name}</td>
              <td className="p-2">{inv.customer_id}</td>
              <td className="p-2">{inv.customer.domain}</td>
              <td className="p-2">{inv.partner.Name}</td>
              <td className="p-2">{new Date(inv.charge_start_date).toLocaleDateString()}</td>
              <td className="p-2">{new Date(inv.charge_end_date).toLocaleDateString()}</td>
            </tr>
          )) :
            <td colSpan={7} className="text-center p-2">Nenhum nota encontrada</td>
          }
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>Página {page} de {totalPages}</span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}

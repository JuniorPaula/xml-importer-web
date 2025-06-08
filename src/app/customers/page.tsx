'use client'
import Cookies from "js-cookie";
import { createApi } from '@/services/axios-service'
import { useEffect, useState } from 'react'
import { useCallback } from 'react'


type Customer = {
  id: string
  name: string
  domain: string
  country: string
}

type ApiResponse = {
  data: Customer[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  status: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getCustomers = useCallback(async () => {
    const token = Cookies.get("_token_")
    const api = createApi(token);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: '10',
    })
    if (search) params.append('name', search)
    if (country) params.append('country', country)
    try {
      const res = await api.get(`/api/customers?${params.toString()}`)
      const data: ApiResponse = res.data
      setCustomers(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }, [page, search, country])

  useEffect(() => {
    getCustomers()
  }, [getCustomers])

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Clientes</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setPage(1)
          }}
          className="p-2 border rounded w-full md:w-1/4"
        >
          <option value="">Todos os países</option>
          <option value="BR">Brasil</option>
          <option value="AR">Argentina</option>
          <option value="US">Estados Unidos</option>
        </select>
      </div>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">Domínio</th>
            <th className="text-left p-2">País</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t">
              <td className="p-2">{customer.name}</td>
              <td className="p-2">{customer.domain}</td>
              <td className="p-2">{customer.country}</td>
            </tr>
          ))}
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

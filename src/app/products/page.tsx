'use client'

import Cookies from "js-cookie";
import { createApi } from '@/services/axios-service'
import { useCallback, useEffect, useState } from 'react'

type Product = {
  id: string
  name: string
  sku_name: string
  sku_id: string
  availability_id: string
  publisher_name: string
  entitlement_desc: string
}

type ApiResponse = {
  data: Product[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  status: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getProducts = useCallback(async () => {
    const token = Cookies.get("_token_")
    const api = createApi(token);

    const params = new URLSearchParams({
      page: String(page),
      pageSize: '10',
    })
    if (search) params.append('name', search)

      try {
      const res = await api.get(`/api/products?${params.toString()}`)
      const data: ApiResponse = res.data
      setProducts(data.data)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }, [page, search])

  useEffect(() => {
    getProducts()
  }, [getProducts])

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Produtos</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Buscar produto..."
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
            <th className="text-left p-2">Nome</th>
            <th className="text-left p-2">SKU</th>
            <th className="text-left p-2">Disponibilidade</th>
            <th className="text-left p-2">Editor</th>
            <th className="text-left p-2">Origem</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t">
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.sku_name}</td>
              <td className="p-2">{product.availability_id}</td>
              <td className="p-2">{product.publisher_name}</td>
              <td className="p-2">{product.entitlement_desc}</td>
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

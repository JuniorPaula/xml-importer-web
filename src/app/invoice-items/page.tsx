"use client";

import { createApi } from "@/services/axios-service";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

type InvoiceItem = {
  id: string;
  invoice_id: string;
  product: {
    name: string
  };
  meter_category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export default function InvoiceItemsPage() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("meter_category");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const pageSize = 10;

  useEffect(() => {
    const fetchItems = async () => {
      const token = Cookies.get("_token_");
      const api = createApi(token);
      try {
        const res = await api.get("/api/invoice-items", {
          params: {
            page,
            pageSize,
            orderBy: sortField,
            order: sortOrder,
          },
        });
        console.log(res.data.data)
        setItems(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching invoice items", err)
      }
    };
    fetchItems();
  }, [page, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold mb-6">Itens da Fatura</h1>

      <table className="w-full bg-white rounded shadow text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2 cursor-pointer" onClick={() => handleSort("product_name")}>
              Produto
            </th>
            <th className="text-left p-2 cursor-pointer" onClick={() => handleSort("meter_category")}>
              Categoria
            </th>
            <th className="text-left p-2">Qtd.</th>
            <th className="text-left p-2">Preço Unitário</th>
            <th className="text-left p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
                Nenhum item encontrado.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-2">{item.product.name}</td>
                <td className="p-2">{item.meter_category}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">
                  {item.unit_price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td className="p-2">
                  {item.total_price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

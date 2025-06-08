'use client'

import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import { createApi } from '@/services/axios-service';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

type Insight = { text: string; type: 'info' | 'positive' | 'warning' | 'danger' }

type SummaryData = {
  total_invoices: number
  total_invoice_items: number
  total_billing: number
  credit_type_distribution: Record<string, number>
  top_products: { product_id: string; product_name: string; total: number }[]
  meter_category_totals: { meter_category: string; total: number }[]
}

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [data, setData] = useState<SummaryData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const insights = getInsights(data as SummaryData)
  const itemPerPage = 10

  const iconMap = {
    info: '🔍',
    positive: '✅',
    warning: '⚠️',
    danger: '❌',
  } as const

  const filterCategories = data?.meter_category_totals
    .filter((cat) => cat.meter_category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.total - a.total)

  const totalPages = Math.ceil((filterCategories?.length ?? 0) / itemPerPage)
  const paginatedCategories = filterCategories?.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage
  ) ?? []


  const getSummary = async () => {
    const token = Cookies.get("_token_")
    const api = createApi(token);
    try {
      const response = await api.get('/api/summary');
      console.log('Summary data:', response.data);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  }

  useEffect(() => {
    getSummary();
  }, [])

  const emptyDoughnutData = {
    labels: ['Sem dados'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['#E5E7EB'],
      },
    ],
  }

  const emptyBarData = {
    labels: ['Sem produtos'],
    datasets: [
      {
        label: 'Faturamento',
        data: [0],
        backgroundColor: '#E5E7EB',
      },
    ],
  }

  const hasCreditData = data && Object.keys(data.credit_type_distribution).length > 0
  const hasTopProducts = data && data.top_products.length > 0
  const hasMeterCategories = data && data.meter_category_totals.length > 0

  const creditDistribution = hasCreditData ? {
    labels: data ? Object.keys(data.credit_type_distribution) : [],
    datasets: [
      {
        label: 'Distribuição de Crédito',
        data: data ? Object.values(data.credit_type_distribution) : [],
        backgroundColor: ['#10B981', '#3B82F6'],
      },
    ],
  } : emptyDoughnutData

  const topProducts = hasTopProducts ? {
    labels: data ? data.top_products.map((p) => p.product_name) : [],
    datasets: [
      {
        label: 'Faturamento',
        data: data ? data.top_products.map((p) => p.total) : [],
        backgroundColor: '#6366F1',
      },
    ],
  } : emptyBarData

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Notas Fiscais">{data?.total_invoices ?? 0}</Card>
        <Card title="Itens">{data?.total_invoice_items ?? 0}</Card>
        <Card title="Faturamento">R$ {data?.total_billing.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? 0}</Card>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Insights Inteligentes</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {insights.map(({ text, type }, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-xl">{iconMap[type]}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartBox title="Distribuição de Créditos">
          <Doughnut data={creditDistribution} />
        </ChartBox>

        <ChartBox title="Top Produtos">
          <Bar data={topProducts} options={{ indexAxis: 'y' }} />
        </ChartBox>
      </div>

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

    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold mt-1">{children}</p>
    </div>
  )
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  )
}

function getInsights(data: SummaryData): Insight[] {
  const insights: Insight[] = []
  if (!data) {
    insights.push({ text: "Nenhuma informação ainda", type: 'warning' })
    return insights
  }

  if (data.total_invoices === 0) {
    insights.push({ text: "Nenhuma nota fiscal foi importada.", type: 'danger' })
  } else {
    insights.push({ text: `Foram importadas ${data.total_invoices} notas fiscais.`, type: 'info' })
  }

  const creditTotal = Object.values(data.credit_type_distribution).reduce((a, b) => a + b, 0)
  const partnerCredit = data.credit_type_distribution['Partner Earned Credit Applied'] || 0
  const creditPercent = (partnerCredit / creditTotal) * 100

  if (creditPercent >= 70) {
    insights.push({ text: "Você está aproveitando muito bem os créditos de parceiro!", type: 'positive' })
  } else if (creditPercent <= 30) {
    insights.push({ text: "Apenas uma pequena parte do consumo foi com créditos de parceiro.", type: 'warning' })
  }

  const topCategory = [...data.meter_category_totals].sort((a, b) => b.total - a.total)[0]
  insights.push({ text: `O maior gasto foi com a categoria: ${topCategory.meter_category}`, type: 'info' })

  const topProduct = data.top_products[0]
  if (topProduct) {
    insights.push({
      text: `Produto mais caro: ${topProduct.product_name} (R$ ${topProduct.total.toFixed(2)})`,
      type: 'info',
    })
  }

  return insights
}

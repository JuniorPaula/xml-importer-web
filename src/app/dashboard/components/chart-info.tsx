import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { SummaryData } from "../page";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

export function ChartInfo(data: SummaryData) {
  const hasCreditData = data && Object.keys(data.credit_type_distribution).length > 0
  const hasTopProducts = data && data.top_products && data.top_products.length > 0

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartBox title="Distribuição de Créditos">
        <Doughnut data={creditDistribution} />
      </ChartBox>

      <ChartBox title="Top Produtos">
        <Bar data={topProducts} options={{ indexAxis: 'y' }} />
      </ChartBox>
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
import { SummaryData } from "../page"

type Insight = { text: string; type: 'info' | 'positive' | 'warning' | 'danger' }

export function Insight(data: SummaryData) {
  const insights = getInsights(data as SummaryData)

  const iconMap = {
    info: '🔍',
    positive: '✅',
    warning: '⚠️',
    danger: '❌',
  } as const

  return (
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
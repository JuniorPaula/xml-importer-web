import { SummaryData } from "../page";

export function CardInfo(data: SummaryData | null) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Notas Fiscais">{data?.total_invoices ?? 0}</Card>
        <Card title="Itens">{data?.total_invoice_items ?? 0}</Card>
        <Card title="Faturamento">R$ {data?.total_billing.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ?? 0}</Card>
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
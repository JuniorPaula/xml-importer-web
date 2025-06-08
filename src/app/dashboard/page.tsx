'use client'

import Cookies from "js-cookie";
import { useEffect, useState } from 'react'
import { createApi } from '@/services/axios-service';
import { CardInfo } from './components/card-info';
import { Insight } from './components/insight';
import { ChartInfo } from "./components/chart-info";
import { CategoryTable } from "./components/category-table";

export type SummaryData = {
  total_invoices: number
  total_invoice_items: number
  total_billing: number
  credit_type_distribution: Record<string, number>
  top_products: { product_id: string; product_name: string; total: number }[]
  meter_category_totals: { meter_category: string; total: number }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<SummaryData | null>(null)

  const getSummary = async () => {
    const token = Cookies.get("_token_")
    const api = createApi(token);
    try {
      const response = await api.get('/api/summary');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    }
  }

  useEffect(() => {
    getSummary();
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {data && <CardInfo {...data} />}
      {data && <Insight {...data} />}
      {data && <ChartInfo {...data} />}
      {data && <CategoryTable {...data} />}

    </div>
  )
}
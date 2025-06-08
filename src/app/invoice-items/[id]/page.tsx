"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createApi } from "@/services/axios-service";
import Link from "next/link";

type InvoiceItemDetail = {
  id: string;
  invoice_id: string;
  product: {
    name: string;
    sku_id: string;
    sku_name: string;
    availability_id: string;
    publisher_name: string;
    entitlement_desc: string;
  };
  meter_category: string;
  meter_type: string;
  meter_subcategory: string;
  meter_region: string;
  resource_uri: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  billing_currency: string;
  credit_type: string;
  tag: string;
  additional_info: string;
  invoice: {
    customer: {
      name: string;
      domain: string;
      country: string;
    }
    partner: {
      ID: string;
      Name: string;
      MpnID: number;
      Tier2MpnID: number;
    }
  }
};

export default function InvoiceItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<InvoiceItemDetail | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const token = Cookies.get("_token_");
      const api = createApi(token);
      try {
        const res = await api.get(`/api/invoice-items/${id}`);
        setItem(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do item da fatura", err);
      }
    };
    fetchDetail();
  }, [id]);

  if (!item) {
    return <div className="p-6">Carregando detalhes...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Detalhes do Item</h1>
      <div className="bg-white p-4 rounded shadow space-y-2 text-sm">
        <div><strong>ID:</strong> {item.id}</div>
        <div><strong>Fatura:</strong> {item.invoice_id}</div>
        <div><strong>Produto:</strong> {item.product.name}</div>
        <div><strong>Categoria:</strong> {item.meter_category}</div>
        <div><strong>Quantidade:</strong> {item.quantity}</div>
        <div><strong>Preço Unitário:</strong> {item.unit_price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
        <div><strong>Total:</strong> {item.total_price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
        <div><strong>Moeda:</strong> {item.billing_currency}</div>
        <div><strong>Tipo de Crédito:</strong> {item.credit_type}</div>
        <div><strong>Tag:</strong> {item.tag}</div>
        <div><strong>Informações Adicionais:</strong> {item.additional_info}</div>
        <div>
          <strong>Cliente:</strong> {item.invoice.customer.name} ({item.invoice.customer.domain}, {item.invoice.customer.country})
        </div>
        <div>
          <strong>Parceiro:</strong> {item.invoice.partner.Name} (ID: {item.invoice.partner.ID}, MPN ID: {item.invoice.partner.MpnID}, Tier2 MPN ID: {item.invoice.partner.Tier2MpnID})
        </div>
        <div><strong>SKU ID:</strong> {item.product.sku_id}</div>
        <div><strong>SKU Nome:</strong> {item.product.sku_name}</div>
        <div><strong>Disponibilidade ID:</strong> {item.product.availability_id}</div>
        <div><strong>Publicador:</strong> {item.product.publisher_name}</div>
        <div><strong>Descrição do Direito:</strong> {item.product.entitlement_desc}</div>
        <div><strong>Tipo de Medição:</strong> {item.meter_type}</div>
        <div><strong>Subcategoria de Medição:</strong> {item.meter_subcategory}</div>
        <div><strong>Região de Medição:</strong> {item.meter_region}</div>
        <div><strong>URI do Recurso:</strong> {item.resource_uri}</div>
        <div><strong>Unidade:</strong> {item.unit}</div>
      </div>

      <div className="mt-6">
        <Link href="/invoice-items" className="text-blue-600 hover:underline text-sm">Voltar</Link>
      </div>
    </div>
  );
}

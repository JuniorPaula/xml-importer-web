"use client"

import Cookies from "js-cookie"
import { createApi } from "@/services/axios-service"
import { useState, useEffect } from "react"

export default function ImportStatusChecker({ importId }: { importId: string }) {
  const [status, setStatus] = useState("queued")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = Cookies.get("_token_")
    const api = createApi(token)

    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/api/import/${importId}/status`)
        const newStatus = res.data?.data?.status
        setStatus(newStatus)

        if (newStatus === "completed" || newStatus === "failed") {
          clearInterval(interval)
        }
      } catch (err) {
        console.error("Erro ao verificar status da importação:", err)
        setError("Erro ao consultar status.")
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [importId])

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="mt-4 p-4 rounded bg-gray-100 text-sm">
      <p>
        <strong>Status da importação:</strong>{" "}
        <span className={
          status === "completed"
            ? "text-green-600"
            : status === "failed"
            ? "text-red-600"
            : "text-yellow-600"
        }>
          {status === "queued" && "Na fila..."}
          {status === "processing" && "Processando..."}
          {status === "completed" && "Concluído ✅"}
          {status === "failed" && "Falhou ❌"}
        </span>
      </p>
    </div>
  )
}

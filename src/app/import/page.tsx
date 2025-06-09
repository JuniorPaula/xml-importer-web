"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { createApi } from "@/services/axios-service";
import * as XLSX from "xlsx";
import ImportStatusChecker from "./components/import-status-check";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<never[][]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [importId, setImportId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile || !selectedFile.name.endsWith(".xlsx")) {
      toast.error("Apenas arquivos .xlsx são permitidos");
      setFile(null);
      setPreviewData([]);
      return;
    }

    setFile(selectedFile);
    setPreviewLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as never[][];
      const firstRows = jsonData.slice(0, 5);
      setPreviewData(firstRows);
      setPreviewLoading(false);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const token = Cookies.get("_token_");
    const api = createApi(token);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/import/xml", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Arquivo será processado em segundo plano");
      setFile(null);
      setPreviewData([]);
      setImportId(res.data.data.import_id || null);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar o arquivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Importar Arquivo Excel</h1>
      {importId && <ImportStatusChecker importId={importId} />}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded cursor-pointer p-2"
        />
        {previewLoading && (
          <div className="flex items-center justify-center py-6 text-sm text-gray-500">
            <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Carregando pré-visualização...
          </div>
        )}
        {previewData.length > 0 && (
          <div className="overflow-auto border rounded bg-gray-50 p-2">
            <h2 className="text-md font-semibold mb-2">Pré-visualização</h2>
            <table className="text-sm w-full border border-collapse">
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-2 py-1">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          type="submit"
          disabled={!file || loading || previewLoading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-blue-300"
        >
          {loading ? "Enviando..." : "Enviar Arquivo"}
        </button>
      </form>
    </div>
  );
}

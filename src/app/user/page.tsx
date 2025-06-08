"use client";

import { createApi } from "@/services/axios-service";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("_token_");
      const api = createApi(token);
      try {
        const res = await api.get("/api/user");
        setUser(res.data.data);
      } catch (err) {
        console.error("Erro to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="p-6">Carregando usuário...</div>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Dados do Usuário</h1>
      <div className="max-w-md">
        <div className="mb-2">
          <strong>Nome:</strong> {user.first_name} {user.last_name}
        </div>
        <div className="mb-2">
          <strong>E-mail:</strong> {user.email}
        </div>
        <div className="mb-2">
          <strong>Criado em:</strong>{" "}
          {new Date(user.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        <div className="mb-2">
          <strong>Última atualização:</strong>{" "}
          {new Date(user.updated_at).toLocaleString("pt-BR")}
        </div>
      </div>
    </div>
  );
}

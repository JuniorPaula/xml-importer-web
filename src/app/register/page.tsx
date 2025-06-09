"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createApi } from "@/services/axios-service";
import Link from "next/link";
import { AxiosError } from "axios";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const api = createApi();
      await api.post("/api/register", data);

      toast.success("Registro realizado com sucesso!");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error(error.response)
  
        if (error?.response?.data.message.includes("passwords doest match")) {
          toast.error("Senhas não conferem!")
        } else {
          toast.error("Erro ao registrar. Tente novamente.");
        }
      }
      else {
        console.error("Unexpected error:", error);
        toast.error("Erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 shadow-md w-full max-w-md space-y-4 my-9">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Registrar-se</h2>

        <div>
          <label htmlFor="first_name">Nome</label>
          <input
            id="first_name"
            {...register("first_name", { required: "Nome é obrigatório" })}
            placeholder="Seu nome"
            className="w-full mb-6 p-2 border rounded"
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
        </div>

        <div>
          <label htmlFor="last_name">Sobrenome</label>
          <input
            id="last_name"
            placeholder="Seu sobrenome"
            className="w-full mb-6 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email é obrigatório" })}
            placeholder="email@exemplo.com"
            className="w-full mb-6 p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Senha é obrigatória", minLength: { value: 6, message: "A senha deve ter pelo menos 6 caracteres" } })}
            placeholder="********"
            className="w-full mb-6 p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirm_password">Confirmação de senha</label>
          <input
            id="confirm_password"
            type="password"
            {...register("confirm_password", { required: "Confirmação de senha é obrigatória" })}
            placeholder="********"
            className="w-full mb-6 p-2 border rounded"
          />
          {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
        </div>

        <button type="submit" className="w-full mb-4 mt-2 bg-green-600 hover:bg-green-700 text-white p-2">
          Registrar
        </button>

        <p className="text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </main>
  );
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { loginUser } from '@/services/auth-service'
import { useAuth } from '@/context/auth-context'
import { toast } from 'react-toastify'

const logo = "/assets/logo.png"

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { token, user} = await loginUser({ email, password });
      login(user, token)

      toast.success("Login realizado com sucesso!");
    } catch {
      toast.error("Erro no login, verifique suas credenciais.");
    }
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div>
          <Image
            src={logo}
            alt="eNube Logo"
            width={150}
            height={150}
            priority
            className="mb-6" />
        </div>
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <input
            type="password"
            placeholder="Senha"
            className="w-full mb-6 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Entrar
          </button>
          <p className="text-center text-sm mt-3">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Registre-se
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";

export default function LoginCliente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (authError) {
      setError("Correo o contraseña incorrectos. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    router.push("/cliente/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-[#1a1a1a] px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Servi<span className="text-[#FBBF24]">RD</span>
        </Link>
        <Link href="/" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Volver al inicio
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md w-full">

          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🏠</div>
            <h1 className="text-2xl font-extrabold text-[#1a1a1a] mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-500 text-sm">
              Inicia sesión para ver tus trabajos y cotizaciones
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                placeholder="tu@correo.com"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-[#FBBF24] font-bold py-4 rounded-xl text-base hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/registro-cliente" className="text-[#1a1a1a] font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}``
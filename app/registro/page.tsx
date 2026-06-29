"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/client";
import { deleteAuthUser } from "./actions";

const categories = [
  { icon: "🔧", label: "Plomería", value: "plomeria" },
  { icon: "⚡", label: "Electricidad", value: "electricidad" },
  { icon: "❄️", label: "Aire Acondicionado", value: "aire_acondicionado" },
  { icon: "🏠", label: "Construcción", value: "construccion" },
  { icon: "🎨", label: "Pintura", value: "pintura" },
  { icon: "🪟", label: "Carpintería", value: "carpinteria" },
  { icon: "🧹", label: "Limpieza", value: "limpieza" },
  { icon: "🔒", label: "Cerrajería", value: "cerrajeria" },
];

const zones = [
  { label: "Distrito Nacional", value: "distrito_nacional" },
  { label: "Santo Domingo Este", value: "santo_domingo_este" },
  { label: "Santo Domingo Norte", value: "santo_domingo_norte" },
  { label: "Santo Domingo Oeste", value: "santo_domingo_oeste" },
  { label: "Los Alcarrizos", value: "los_alcarrizos" },
  { label: "Pedro Brand", value: "pedro_brand" },
];

export default function Registro() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    category: "",
    zone: "",
    bio: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Error al crear la cuenta.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("providers").insert({
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      email: form.email,
      category: form.category,
      zone: form.zone,
      bio: form.bio,
      user_id: authData.user.id,
      credits: 3,
    });

    if (profileError) {
      await deleteAuthUser(authData.user.id);
      await supabase.auth.signOut();
      setError("Error al guardar tu perfil. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-[#1a1a1a] px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white">
            Servi<span className="text-[#FBBF24]">RD</span>
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md w-full text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-3">
              ¡Registro exitoso!
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Tu cuenta ha sido creada. Ya puedes iniciar sesión y ver los
              trabajos disponibles en tu zona.
            </p>
            <Link
              href="/login"
              className="bg-[#1a1a1a] text-[#FBBF24] font-bold px-6 py-3 rounded-xl inline-block hover:bg-gray-800 transition-colors"
            >
              Iniciar sesión →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a1a1a] px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Servi<span className="text-[#FBBF24]">RD</span>
        </Link>
        <Link href="/" className="text-gray-400 text-sm hover:text-white transition-colors">
          ← Volver al inicio
        </Link>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#FBBF24]/15 text-[#b45309] text-xs font-semibold px-4 py-2 rounded-full border border-[#FBBF24]/30 mb-4">
            👷 Para proveedores
          </span>
          <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">
            Regístrate en ServiRD
          </h1>
          <p className="text-gray-500">
            Completa tu perfil y empieza a recibir trabajos cerca de ti.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Información personal
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                  Nombre <span className="text-[#FBBF24]">*</span>
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Juan"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                  Apellido <span className="text-[#FBBF24]">*</span>
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Pérez"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                WhatsApp <span className="text-[#FBBF24]">*</span>
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="809-555-0000"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Correo electrónico <span className="text-[#FBBF24]">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="juan@ejemplo.com"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Contraseña <span className="text-[#FBBF24]">*</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
              />
            </div>

            <hr className="border-gray-100" />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tu servicio
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                  Categoría <span className="text-[#FBBF24]">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors bg-white"
                >
                  <option value="" disabled>Selecciona</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                  Zona <span className="text-[#FBBF24]">*</span>
                </label>
                <select
                  name="zone"
                  required
                  value={form.zone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors bg-white"
                >
                  <option value="" disabled>Selecciona</option>
                  {zones.map((zone) => (
                    <option key={zone.value} value={zone.value}>
                      {zone.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Cuéntanos sobre tu experiencia
              </label>
              <textarea
                name="bio"
                placeholder="Ej: Tengo 10 años de experiencia en plomería residencial..."
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors resize-none"
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
              {loading ? "Registrando..." : "Registrarme como proveedor"}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5 leading-relaxed">
          Al registrarte aceptas nuestros términos de uso.
          Tu información nunca será compartida con terceros.
        </p>
      </div>
    </div>
  );
}
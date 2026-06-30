"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";

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

export default function Publicar() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    zone: "",
    contactName: "",
    contactPhone: "",
  });

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login-cliente");
        return;
      }

      const { data: customer } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!customer) {
        router.push("/login-cliente");
        return;
      }

      setCustomerId(customer.id);
      setForm((f) => ({
        ...f,
        contactName: `${customer.first_name} ${customer.last_name}`,
        contactPhone: customer.phone,
      }));
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión para publicar un trabajo.");
      setLoading(false);
      return;
    }

    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!customer) {
      setError("No se encontró tu perfil. Intenta iniciar sesión de nuevo.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("jobs").insert({
      title: form.title,
      description: form.description,
      category: form.category,
      zone: form.zone,
      contact_name: form.contactName,
      contact_phone: form.contactPhone,
      status: "open",
      customer_id: customer.id,
    });

    if (insertError) {
      setError("Hubo un error al publicar tu trabajo. Intenta de nuevo.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
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
              ¡Trabajo publicado!
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Puedes ver las cotizaciones que recibas en tu dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/cliente/dashboard"
                className="bg-[#1a1a1a] text-[#FBBF24] font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Ver mi dashboard →
              </Link>
              <Link
                href="/"
                className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                ← Volver al inicio
              </Link>
            </div>
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
            🏠 Para clientes
          </span>
          <h1 className="text-3xl font-extrabold text-[#1a1a1a] mb-2">
            Publica tu trabajo
          </h1>
          <p className="text-gray-500">
            Describe lo que necesitas y recibe cotizaciones de proveedores verificados.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Detalles del trabajo
            </p>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Título del trabajo <span className="text-[#FBBF24]">*</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="Ej: Se me dañó el inodoro"
                required
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                Descripción <span className="text-[#FBBF24]">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe el problema con más detalle..."
                required
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] transition-colors resize-none"
              />
            </div>

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

            <hr className="border-gray-100" />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Tu información de contacto
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                  Tu nombre
                </label>
                <input
                  name="contactName"
                  type="text"
                  value={form.contactName}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                  Tu WhatsApp
                </label>
                <input
                  name="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
                />
              </div>
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
              {loading ? "Publicando..." : "Publicar trabajo"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";

const categoryMap: Record<string, string> = {
  plomeria: "🔧 Plomería",
  electricidad: "⚡ Electricidad",
  aire_acondicionado: "❄️ Aire Acondicionado",
  construccion: "🏠 Construcción",
  pintura: "🎨 Pintura",
  carpinteria: "🪟 Carpintería",
  limpieza: "🧹 Limpieza",
  cerrajeria: "🔒 Cerrajería",
};

const zoneMap: Record<string, string> = {
  distrito_nacional: "Distrito Nacional",
  santo_domingo_este: "Santo Domingo Este",
  santo_domingo_norte: "Santo Domingo Norte",
  santo_domingo_oeste: "Santo Domingo Oeste",
  los_alcarrizos: "Los Alcarrizos",
  pedro_brand: "Pedro Brand",
};

type Provider = {
  id: string;
  first_name: string;
  last_name: string;
  category: string;
  zone: string;
  credits: number;
};

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  contact_phone: string;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotingJob, setQuotingJob] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!providerData) {
        router.push("/login");
        return;
      }

      setProvider(providerData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select("*")
        .eq("category", providerData.category)
        .eq("zone", providerData.zone)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      setJobs(jobsData || []);
      setLoading(false);
    }

    load();
  }, [router]);

  async function handleQuote(job: Job) {
    if (!provider) return;
    if (provider.credits <= 0) {
      alert("No tienes créditos disponibles. Por favor compra más créditos.");
      return;
    }

    const confirmed = window.confirm(
      `¿Usar 1 crédito para cotizar este trabajo?\n\n"${job.title}"`
    );
    if (!confirmed) return;

    setQuotingJob(job.id);

    const { error } = await supabase
      .from("providers")
      .update({ credits: provider.credits - 1 })
      .eq("id", provider.id);

    if (error) {
      alert("Hubo un error. Por favor intenta de nuevo.");
      setQuotingJob(null);
      return;
    }

    setProvider({ ...provider, credits: provider.credits - 1 });

    const message = `Hola, vi tu trabajo en ServiRD: "${job.title}". Me gustaría enviarte una cotización.`;
    window.open(
      `https://wa.me/1${job.contact_phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    setQuotingJob(null);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a1a1a] px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white">
          Servi<span className="text-[#FBBF24]">RD</span>
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-gray-400 text-sm hidden md:block">
            {provider?.first_name} {provider?.last_name}
          </span>
          <button
            onClick={handleLogout}
            className="text-gray-400 text-sm border border-gray-600 px-4 py-2 rounded-lg hover:border-[#FBBF24] hover:text-[#FBBF24] transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#1a1a1a] mb-1">
            👋 Bienvenido, {provider?.first_name}
          </h1>
          <p className="text-gray-500 text-sm">
            {categoryMap[provider?.category || ""]} &nbsp;·&nbsp;{" "}
            {zoneMap[provider?.zone || ""]}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Trabajos disponibles</p>
            <p className="text-3xl font-extrabold text-[#1a1a1a]">
              {jobs.length}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Créditos disponibles</p>
            <p className="text-3xl font-extrabold text-[#FBBF24]">
              {provider?.credits}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Trabajos completados</p>
            <p className="text-3xl font-extrabold text-[#1a1a1a]">0</p>
          </div>
        </div>

        {/* Jobs */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#1a1a1a]">
            Trabajos disponibles
          </h2>
          {jobs.length > 0 && (
            <span className="bg-[#FBBF24] text-[#1a1a1a] text-xs font-bold px-3 py-1 rounded-full">
              {jobs.length} nuevos
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {jobs.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-14 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-bold text-[#1a1a1a] mb-2">
                No hay trabajos disponibles aún
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Cuando un cliente publique un trabajo en tu zona y categoría,
                aparecerá aquí automáticamente.
              </p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border-l-4 border-l-[#FBBF24] border border-gray-100 rounded-2xl p-6 flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-[#1a1a1a] mb-2">{job.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {job.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">
                      📍 {zoneMap[job.zone]}
                    </span>
                    <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">
                      {categoryMap[job.category]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleQuote(job)}
                  disabled={provider?.credits === 0 || quotingJob === job.id}
                  className="bg-[#1a1a1a] text-[#FBBF24] font-bold px-5 py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                >
                  {quotingJob === job.id ? "..." : provider?.credits === 0 ? "Sin créditos" : "Cotizar (1 crédito)"}
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
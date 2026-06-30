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
  created_at: string;
  alreadyQuoted?: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [quoteModalJob, setQuoteModalJob] = useState<Job | null>(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteMessage, setQuoteMessage] = useState("");
  const [submittingQuote, setSubmittingQuote] = useState(false);

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

      const { data: existingQuotes } = await supabase
        .from("quotes")
        .select("job_id")
        .eq("provider_id", providerData.id);

      const quotedJobIds = new Set((existingQuotes || []).map((q) => q.job_id));

      const jobsWithFlag = (jobsData || []).map((job) => ({
        ...job,
        alreadyQuoted: quotedJobIds.has(job.id),
      }));

      setJobs(jobsWithFlag);
      setLoading(false);
    }

    load();
  }, [router]);

  function openQuoteModal(job: Job) {
    if (!provider || provider.credits <= 0) {
      alert("No tienes créditos disponibles. Por favor compra más créditos.");
      return;
    }
    setQuoteModalJob(job);
    setQuotePrice("");
    setQuoteMessage("");
  }

  async function handleSubmitQuote() {
    if (!provider || !quoteModalJob) return;
    if (!quotePrice || !quoteMessage) {
      alert("Por favor completa el precio y el mensaje.");
      return;
    }

    setSubmittingQuote(true);

    const { error: quoteError } = await supabase.from("quotes").insert({
      job_id: quoteModalJob.id,
      provider_id: provider.id,
      price: parseInt(quotePrice),
      message: quoteMessage,
      status: "pending",
    });

    if (quoteError) {
      alert("Hubo un error al enviar la cotización. Intenta de nuevo.");
      setSubmittingQuote(false);
      return;
    }

    const newCredits = provider.credits - 1;

    await supabase
      .from("providers")
      .update({ credits: newCredits })
      .eq("id", provider.id);

    await supabase.from("credit_transactions").insert({
      provider_id: provider.id,
      amount: -1,
      type: "spend",
      description: `Cotización enviada: ${quoteModalJob.title}`,
    });

    setProvider({ ...provider, credits: newCredits });
    setJobs(
      jobs.map((j) =>
        j.id === quoteModalJob.id ? { ...j, alreadyQuoted: true } : j
      )
    );
    setQuoteModalJob(null);
    setSubmittingQuote(false);
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

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#1a1a1a] mb-1">
            👋 Bienvenido, {provider?.first_name}
          </h1>
          <p className="text-gray-500 text-sm">
            {categoryMap[provider?.category || ""]} &nbsp;·&nbsp;{" "}
            {zoneMap[provider?.zone || ""]}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Trabajos disponibles</p>
            <p className="text-3xl font-extrabold text-[#1a1a1a]">{jobs.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Créditos disponibles</p>
            <p className="text-3xl font-extrabold text-[#FBBF24]">{provider?.credits}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="text-xs text-gray-400 mb-2">Cotizaciones enviadas</p>
            <p className="text-3xl font-extrabold text-[#1a1a1a]">
              {jobs.filter((j) => j.alreadyQuoted).length}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Trabajos disponibles</h2>

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
                {job.alreadyQuoted ? (
                  <span className="text-green-600 font-bold text-sm whitespace-nowrap flex-shrink-0">
                    ✅ Cotizado
                  </span>
                ) : (
                  <button
                    onClick={() => openQuoteModal(job)}
                    disabled={provider?.credits === 0}
                    className="bg-[#1a1a1a] text-[#FBBF24] font-bold px-5 py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                  >
                    {provider?.credits === 0 ? "Sin créditos" : "Cotizar (1 crédito)"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {quoteModalJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full">
            <h3 className="text-lg font-extrabold text-[#1a1a1a] mb-1">
              Enviar cotización
            </h3>
            <p className="text-sm text-gray-500 mb-5">{quoteModalJob.title}</p>

            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Precio (RD$) <span className="text-[#FBBF24]">*</span>
            </label>
            <input
              type="number"
              placeholder="1500"
              value={quotePrice}
              onChange={(e) => setQuotePrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] mb-4"
            />

            <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">
              Mensaje <span className="text-[#FBBF24]">*</span>
            </label>
            <textarea
              placeholder="Puedo hacer este trabajo mañana en la mañana..."
              rows={3}
              value={quoteMessage}
              onChange={(e) => setQuoteMessage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FBBF24] mb-6 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setQuoteModalJob(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmitQuote}
                disabled={submittingQuote}
                className="flex-1 bg-[#1a1a1a] text-[#FBBF24] font-bold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:bg-gray-300"
              >
                {submittingQuote ? "Enviando..." : "Enviar (1 crédito)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
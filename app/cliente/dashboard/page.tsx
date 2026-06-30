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

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
};

type Quote = {
  id: string;
  job_id: string;
  provider_id: string;
  message: string;
  price: number;
  status: string;
  providers: {
    first_name: string;
    last_name: string;
    phone: string;
    category: string;
  };
};

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  status: string;
  created_at: string;
  quotes: Quote[];
};

export default function ClienteDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login-cliente");
        return;
      }

      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!customerData) {
        router.push("/login-cliente");
        return;
      }

      setCustomer(customerData);

      const { data: jobsData } = await supabase
        .from("jobs")
        .select(`
          *,
          quotes:quotes!job_id (
            *,
            providers (
              first_name,
              last_name,
              phone,
              category
            )
          )
        `)
        .eq("customer_id", customerData.id)
        .order("created_at", { ascending: false });

        const normalizedJobs = (jobsData || []).map((job: Job) => ({
          ...job,
          quotes: job.quotes
            ? Array.isArray(job.quotes)
              ? job.quotes
              : [job.quotes]
            : [],
        }));
        console.log("normalizedJobs:", JSON.stringify(normalizedJobs, null, 2));
        setJobs(normalizedJobs);
      setLoading(false);
    }

    load();
  }, [router]);

  async function handleAcceptQuote(quoteId: string, jobId: string) {
    const confirmed = window.confirm(
      "¿Aceptar esta cotización? El trabajo se marcará como asignado."
    );
    if (!confirmed) return;

    await supabase
      .from("quotes")
      .update({ status: "accepted" })
      .eq("id", quoteId);

    await supabase
      .from("quotes")
      .update({ status: "rejected" })
      .eq("job_id", jobId)
      .neq("id", quoteId);

    await supabase
      .from("jobs")
      .update({ status: "assigned" })
      .eq("id", jobId);

    window.location.reload();
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
            {customer?.first_name} {customer?.last_name}
          </span>
          <button
            onClick={handleLogout}
            className="text-gray-400 text-sm border border-gray-600 px-4 py-2 rounded-lg hover:border-[#FBBF24] hover:text-[#FBBF24] transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10">

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1a1a] mb-1">
              👋 Hola, {customer?.first_name}
            </h1>
            <p className="text-gray-500 text-sm">
              Aquí puedes ver tus trabajos y las cotizaciones que recibes.
            </p>
          </div>
          <Link
            href="/publicar"
            className="bg-[#FBBF24] text-[#1a1a1a] font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#f0a500] transition-colors whitespace-nowrap"
          >
            + Publicar trabajo
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-14 text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="font-bold text-[#1a1a1a] mb-2">
              Aún no has publicado ningún trabajo
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Publica tu primer trabajo y empieza a recibir cotizaciones.
            </p>
            <Link
              href="/publicar"
              className="bg-[#1a1a1a] text-[#FBBF24] font-bold px-6 py-3 rounded-xl inline-block hover:bg-gray-800 transition-colors"
            >
              Publicar mi primer trabajo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-100 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="font-bold text-[#1a1a1a] mb-1">{job.title}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">
                        📍 {zoneMap[job.zone]}
                      </span>
                      <span className="text-xs bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1 rounded-full">
                        {categoryMap[job.category]}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      job.status === "assigned"
                        ? "bg-green-50 text-green-600"
                        : "bg-[#FBBF24]/15 text-[#92660a]"
                    }`}
                  >
                    {job.status === "assigned" ? "✅ Asignado" : "🔍 Buscando"}
                  </span>
                </div>

                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {job.description}
                </p>

                <hr className="border-gray-100 mb-4" />

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Cotizaciones ({job.quotes?.length || 0})
                </p>

                {!Array.isArray(job.quotes) || job.quotes.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Aún no has recibido cotizaciones para este trabajo.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {(Array.isArray(job.quotes) ? job.quotes : []).map((quote) => (
                      <div
                        key={quote.id}
                        className={`border rounded-xl p-4 flex justify-between items-center gap-4 flex-wrap ${
                          quote.status === "accepted"
                            ? "border-green-200 bg-green-50"
                            : quote.status === "rejected"
                            ? "border-gray-100 bg-gray-50 opacity-60"
                            : "border-gray-200"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-[#1a1a1a]">
                            {quote.providers.first_name} {quote.providers.last_name}
                          </p>
                          <p className="text-xs text-gray-400 mb-1">
                            {categoryMap[quote.providers.category]}
                          </p>
                          <p className="text-sm text-gray-600">{quote.message}</p>
                          <p className="font-extrabold text-[#1a1a1a] mt-1">
                            RD${quote.price}
                          </p>
                        </div>
                        {quote.status === "pending" && job.status !== "assigned" && (
                          <button
                            onClick={() => handleAcceptQuote(quote.id, job.id)}
                            className="bg-[#1a1a1a] text-[#FBBF24] font-bold px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
                          >
                            Aceptar
                          </button>
                        )}
                        {quote.status === "accepted" && (
                          <span className="text-green-600 font-bold text-sm">
                            ✅ Aceptada
                          </span>
                        )}
                        {quote.status === "rejected" && (
                          <span className="text-gray-400 text-sm">Rechazada</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="bg-[#1a1a1a] text-white text-center px-4 py-24">
        <span className="inline-block bg-[#FBBF24]/15 text-[#FBBF24] text-xs font-semibold px-4 py-2 rounded-full border border-[#FBBF24]/30 mb-6">
          🇩🇴 Hecho para la República Dominicana
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight max-w-2xl mx-auto mb-5">
          Tu hogar merece{" "}
          <span className="text-[#FBBF24]">lo mejor</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Encuentra técnicos verificados cerca de ti. Publica tu trabajo,
          recibe cotizaciones, y contrata con total confianza.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/publicar"
            className="bg-[#FBBF24] text-[#1a1a1a] font-bold px-7 py-4 rounded-xl text-base hover:bg-[#f0a500] transition-colors"
          >
            Publicar un trabajo
          </Link>
          <Link
            href="/#categories"
            className="bg-transparent text-white font-semibold px-7 py-4 rounded-xl text-base border border-gray-600 hover:border-gray-400 transition-colors"
          >
            Ver categorías
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-xs font-bold text-[#FBBF24] uppercase tracking-widest mb-3">
          Cómo funciona
        </p>
        <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-3">
          Tres pasos y listo
        </h2>
        <p className="text-gray-500 mb-12">
          Sin llamadas, sin intermediarios, sin perder tiempo.
        </p>
        <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
          {[
            {
              num: "1",
              title: "Publica tu trabajo",
              desc: "Describe lo que necesitas, añade fotos si quieres, y elige tu barrio.",
            },
            {
              num: "2",
              title: "Recibe cotizaciones",
              desc: "Proveedores verificados cerca de ti te envían sus precios en minutos.",
            },
            {
              num: "3",
              title: "Contrata con confianza",
              desc: "Revisa perfiles, lee reseñas reales, y elige al mejor.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="flex-1 min-w-[200px] max-w-[260px] bg-white border border-gray-100 rounded-2xl p-8 text-left"
            >
              <div className="w-9 h-9 bg-[#1a1a1a] text-[#FBBF24] text-sm font-extrabold rounded-xl flex items-center justify-center mb-5">
                {step.num}
              </div>
              <h3 className="font-bold text-[#1a1a1a] mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="bg-white py-20 px-4 text-center">
        <p className="text-xs font-bold text-[#FBBF24] uppercase tracking-widest mb-3">
          Categorías
        </p>
        <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-3">
          ¿Qué necesitas hoy?
        </h2>
        <p className="text-gray-500 mb-12">
          De plomería hasta limpieza — todos los servicios en un solo lugar.
        </p>
        <div className="flex flex-wrap gap-4 justify-center max-w-3xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/publicar?category=${cat.value}`}
              className="bg-gray-50 border border-gray-200 rounded-2xl px-7 py-5 font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all"
            >
              <span className="block text-3xl mb-2">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <p className="text-xs font-bold text-[#FBBF24] uppercase tracking-widest mb-3">
          Por qué ServiRD
        </p>
        <h2 className="text-3xl font-extrabold text-[#1a1a1a] mb-3">
          Construido sobre confianza
        </h2>
        <p className="text-gray-500 mb-12">
          Cada proveedor pasa por verificación antes de aparecer en la plataforma.
        </p>
        <div className="flex flex-wrap gap-6 justify-center max-w-3xl mx-auto">
          {[
            { icon: "✅", title: "Identidad verificada", desc: "Cédula y teléfono confirmados en cada perfil." },
            { icon: "⭐", title: "Reseñas reales", desc: "Solo clientes que completaron un trabajo pueden opinar." },
            { icon: "💬", title: "Cotizaciones claras", desc: "El precio se acuerda antes de que el técnico llegue." },
            { icon: "📲", title: "Soporte directo", desc: "¿Algo salió mal? Te ayudamos a resolverlo." },
          ].map((item) => (
            <div key={item.title} className="flex-1 min-w-[180px] max-w-[220px] text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-[#1a1a1a] py-20 px-4 text-center border-t-4 border-[#FBBF24]">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          ¿Eres técnico o{" "}
          <span className="text-[#FBBF24]">proveedor</span>?
        </h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">
          Únete a ServiRD y recibe trabajos cerca de ti. Sin comisiones al
          inicio — solo crea tu perfil y empieza a cotizar.
        </p>
        <Link
          href="/registro"
          className="bg-[#FBBF24] text-[#1a1a1a] font-bold px-9 py-4 rounded-xl text-base hover:bg-[#f0a500] transition-colors inline-block"
        >
          Registrarme como proveedor
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-center py-6 text-sm text-gray-600 border-t border-gray-800">
        © 2026 <span className="text-[#FBBF24]">ServiRD</span> — República Dominicana 🇩🇴
      </footer>
    </div>
  );
}
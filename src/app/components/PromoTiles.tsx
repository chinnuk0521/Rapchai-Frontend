import Link from "next/link";

export default function PromoTiles() {
  const promos = [
    { title: "Order Online", desc: "Quick bites and fresh brews", href: "https://wa.me/919000000000", external: true },
    { title: "Book Events", desc: "Rap nights and community jams", href: "/events" },
    { title: "Private Dining", desc: "Corporate & birthday packages", href: "/catering" },
  ];
  return (
    <section className="mt-16 mb-8">
      <div className="w-[95%] mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((p) => (
          p.external ? (
            <a 
              key={p.title} 
              href={p.href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="rounded-2xl bg-gradient-to-br from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="text-2xl font-black text-white mb-3 group-hover:text-[var(--rc-creamy-beige)] transition-colors">{p.title}</div>
              <div className="text-base text-white/90 font-semibold">{p.desc}</div>
              <div className="mt-4 flex items-center text-white/80 group-hover:text-white transition-colors">
                <span className="text-sm font-bold">Explore →</span>
              </div>
            </a>
          ) : (
            <Link 
              key={p.title} 
              href={p.href} 
              className="rounded-2xl bg-gradient-to-br from-white to-[var(--rc-creamy-beige)] p-8 border-2 border-[var(--rc-espresso-brown)]/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="text-2xl font-black text-[var(--rc-espresso-brown)] mb-3 group-hover:text-[var(--rc-orange)] transition-colors">{p.title}</div>
              <div className="text-base text-[var(--rc-text-secondary)] font-semibold">{p.desc}</div>
              <div className="mt-4 flex items-center text-[var(--rc-orange)] group-hover:text-[var(--rc-espresso-brown)] transition-colors">
                <span className="text-sm font-bold">Explore →</span>
              </div>
            </Link>
          )
        ))}
      </div>
    </section>
  );
}



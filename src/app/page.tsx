import Link from "next/link";
import HeroSlider from "./components/HeroSlider";
import PromoTiles from "./components/PromoTiles";
import HomeFooter from "./components/HomeFooter";
import { IMG } from "./lib/images";

function Section({ title, children, cta }: { title: string; children: React.ReactNode; cta?: React.ReactNode }) {
  return (
    <section className="mt-16">
      <div className="flex items-end justify-between">
        <h2 className="text-3xl font-bold text-[var(--rc-espresso-brown)]">{title}</h2>
        {cta}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="w-full bg-[var(--rc-creamy-beige)] -mt-16">
      <HeroSlider />
      <div className="pb-20 bg-[var(--rc-creamy-beige)]">
        <div className="w-[95%] mx-auto px-4">
        <Section title="Our Philosophy" cta={<Link href="/about" className="text-lg font-bold text-[var(--rc-orange)] hover:text-[var(--rc-espresso-brown)] transition-colors underline">Read More</Link>}>
          <p className="max-w-4xl text-lg text-[var(--rc-text-secondary)] font-medium leading-relaxed">At Rapchai, food starts conversations in our cozy, vibrant, and affordable cafe. Enjoy a healthy continental menu, meet new people, and vibe at our rap music events.</p>
        </Section>
        <PromoTiles />
        <Section title="Menu Highlights" cta={<Link href="/menu" className="text-lg font-bold text-[var(--rc-orange)] hover:text-[var(--rc-espresso-brown)] transition-colors underline">See Full Menu</Link>}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[{t:"Chai & Coffee",img:IMG.chai},{t:"Mini Burgers",img:IMG.burger},{t:"Sandwiches",img:IMG.sandwich}].map(({t,img}) => (
              <div key={t} className="rounded-2xl bg-white shadow-lg ring-2 ring-[var(--rc-espresso-brown)]/10 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full">
                <div className="h-56 rounded-xl bg-center bg-cover mb-4" style={{ backgroundImage: `url(${img})` }} />
                <div className="font-bold text-[var(--rc-espresso-brown)] text-xl mb-2">{t}</div>
                <div className="text-[var(--rc-text-secondary)] font-medium">Crafted with quality ingredients. Veg and non-veg options.</div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Upcoming Events" cta={<Link href="/events" className="text-lg font-bold text-[var(--rc-orange)] hover:text-[var(--rc-espresso-brown)] transition-colors underline">View All</Link>}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Rap Night Live #47",
                date: "Friday, Jan 24",
                time: "7:00 PM - 10:00 PM",
                description: "Open mic rap battles, freestyle cyphers, and live performances",
                image: IMG.event,
                platforms: ["BookMyShow", "Swiggy Scenes", "District"]
              },
              {
                title: "Community Open Mic",
                date: "Saturday, Jan 25", 
                time: "6:00 PM - 9:00 PM",
                description: "All genres welcome - rap, poetry, spoken word, and acoustic performances",
                image: IMG.interior,
                platforms: ["BookMyShow", "District"]
              }
            ].map((event, i) => (
              <div key={i} className="rounded-3xl bg-gradient-to-br from-white to-[var(--rc-creamy-beige)] shadow-2xl ring-2 ring-[var(--rc-orange)]/20 p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group overflow-hidden">
                <div className="relative h-64 rounded-2xl bg-center bg-cover mb-6 overflow-hidden" style={{ backgroundImage: `url(${event.image})` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[var(--rc-orange)] text-white rounded-full text-sm font-bold">Live Event</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[var(--rc-orange)] transition-colors">{event.title}</h3>
                    <div className="text-white/90 font-semibold text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[var(--rc-text-secondary)] font-semibold mb-6 leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {event.platforms.map((platform) => (
                    <a 
                      key={platform}
                      href="#" 
                      className="px-4 py-2 bg-[var(--rc-orange)]/10 text-[var(--rc-orange)] rounded-full hover:bg-[var(--rc-orange)] hover:text-white transition-all duration-300 font-bold text-sm border border-[var(--rc-orange)]/30"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white py-3 rounded-xl font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all duration-300 transform hover:scale-105 shadow-lg">
                  RSVP Now
                </button>
              </div>
            ))}
          </div>
        </Section>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
}

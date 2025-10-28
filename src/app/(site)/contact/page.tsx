export const metadata = {
  title: "Contact",
  description: "Reach Rapchai Café — address, phone, hours, and contact form.",
};

export default function ContactPage() {
  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <h1 className="text-4xl font-bold text-[var(--rc-espresso-brown)] mb-8">Contact</h1>
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-[var(--rc-espresso-brown)]/10">
              <h2 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-4">Visit Us</h2>
              <div className="text-lg text-[var(--rc-text-secondary)] font-medium mb-4">Rapchai — 86/7, KR Gardens 2nd main road, Koramangala 8th Block, Bengaluru, Karnataka 560095</div>
              <div className="text-lg text-[var(--rc-text-secondary)] mb-2">Phone: <a href="tel:+918792896633" className="underline font-bold text-[var(--rc-orange)]">+91 87928 96633</a></div>
              <div className="text-lg text-[var(--rc-text-secondary)] mb-2">WhatsApp: <a href="https://wa.me/918792896633" className="underline font-bold text-[var(--rc-orange)]" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></div>
              <div className="text-lg text-[var(--rc-text-secondary)] font-bold">Hours: Mon–Sat 11:00 AM – 09:00 PM, Sunday by appointment</div>
            </div>
            <div className="aspect-video rounded-2xl overflow-hidden ring-2 ring-[var(--rc-espresso-brown)]/10 shadow-lg">
              <iframe title="Map" className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Koramangala%2C%20Bengaluru&output=embed" />
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-[var(--rc-orange)]/20">
            <h2 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-6">Send us a Message</h2>
            <form className="grid gap-6">
              <div>
                <label className="text-lg font-bold text-[var(--rc-espresso-brown)] mb-2 block">Name</label>
                <input className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label className="text-lg font-bold text-[var(--rc-espresso-brown)] mb-2 block">Email</label>
                <input className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-lg font-bold text-[var(--rc-espresso-brown)] mb-2 block">Message</label>
                <textarea className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors resize-none" rows={4} placeholder="How can we help?" />
              </div>
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold text-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all transform hover:scale-105 shadow-lg">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



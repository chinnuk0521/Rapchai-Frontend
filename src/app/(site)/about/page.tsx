export const metadata = {
  title: "About Us",
  description: "Our Philosophy — connecting people through food and music at Rapchai Café.",
};

export default function AboutPage() {
  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <h1 className="text-4xl font-bold text-[var(--rc-espresso-brown)] mb-6">Our Philosophy</h1>
        <p className="text-lg text-[var(--rc-text-secondary)] max-w-4xl leading-relaxed font-medium mb-12">
          At Rapchai, we believe that food is a classic conversation starter, especially in our affordable vibrant cafe. It helps break the ice when chatting with a stranger, leading to discussions about our healthy continental menu and sometimes even connecting over rap music events, making the conversation more meaningful and helpful.
        </p>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl overflow-hidden ring-2 ring-[var(--rc-espresso-brown)]/10 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-center bg-cover" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop)` }} />
            <div className="p-6">
              <div className="font-bold text-[var(--rc-espresso-brown)] text-xl mb-2">Team Moments</div>
              <div className="text-[var(--rc-text-secondary)] font-medium">Faces behind the brews and bites.</div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden ring-2 ring-[var(--rc-espresso-brown)]/10 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-center bg-cover" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1600&auto=format&fit=crop)` }} />
            <div className="p-6">
              <div className="font-bold text-[var(--rc-espresso-brown)] text-xl mb-2">Our Space</div>
              <div className="text-[var(--rc-text-secondary)] font-medium">Cozy corners with urban energy.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



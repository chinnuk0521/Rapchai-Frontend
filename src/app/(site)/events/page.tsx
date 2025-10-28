import Image from "next/image";
import { IMG } from "../../lib/images";

export const metadata = {
  title: "Events - Rapchai Café",
  description: "Join our rap music events, open mic nights, and community gatherings at Rapchai Café. Book your spot for the next rap night or host your own event.",
};

const events = [
  {
    id: 1,
    title: "Rap Night Live #47",
    date: "Friday, Jan 24",
    time: "7:00 PM - 10:00 PM",
    description: "Open mic rap battles, freestyle cyphers, and live performances",
    type: "Music",
    price: "Free Entry",
    image: IMG.event,
    status: "upcoming",
    platforms: ["BookMyShow", "Swiggy Scenes", "District"]
  },
  {
    id: 2,
    title: "Community Open Mic",
    date: "Saturday, Jan 25",
    time: "6:00 PM - 9:00 PM", 
    description: "All genres welcome - rap, poetry, spoken word, and acoustic performances",
    type: "Community",
    price: "₹50 Entry",
    image: IMG.interior,
    status: "upcoming",
    platforms: ["BookMyShow", "District"]
  },
  {
    id: 3,
    title: "Beat Making Workshop",
    date: "Sunday, Jan 26",
    time: "2:00 PM - 5:00 PM",
    description: "Learn beat production basics with local producers. Bring your laptop!",
    type: "Workshop",
    price: "₹200 Workshop",
    image: IMG.team,
    status: "upcoming",
    platforms: ["BookMyShow"]
  },
  {
    id: 4,
    title: "Rap Night Live #46",
    date: "Friday, Jan 17",
    time: "7:00 PM - 10:00 PM",
    description: "Epic rap battles and freestyle sessions with local artists",
    type: "Music",
    price: "Free Entry",
    image: IMG.event,
    status: "past",
    platforms: ["BookMyShow", "Swiggy Scenes"]
  }
];

export default function EventsPage() {
  const upcomingEvents = events.filter(e => e.status === "upcoming");
  const pastEvents = events.filter(e => e.status === "past");

  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[var(--rc-espresso-brown)] mb-6">Events at Rapchai</h1>
          <p className="text-xl text-[var(--rc-text-secondary)] max-w-4xl font-medium leading-relaxed">
            Join our vibrant community for rap music events, open mic nights, workshops, and more. 
            From freestyle battles to beat-making sessions, there's always something happening at Rapchai.
          </p>
        </div>

      {/* Upcoming Events */}
      <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-8 text-[var(--rc-orange)]">Upcoming Events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="rounded-2xl bg-white shadow-lg ring-2 ring-[var(--rc-espresso-brown)]/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.type === 'Music' ? 'bg-red-500 text-white' :
                    event.type === 'Community' ? 'bg-blue-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {event.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-[var(--rc-espresso-brown)]">{event.title}</h3>
                <div className="text-sm text-[var(--rc-text-secondary)] mb-3 font-medium">
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">{event.time}</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--rc-text-secondary)] mb-4 font-medium">{event.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[var(--rc-espresso-brown)] bg-yellow-200 px-3 py-1 rounded-full border border-yellow-300">{event.price}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.platforms.map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="text-xs px-3 py-1 bg-[var(--rc-creamy-beige)] text-[var(--rc-espresso-brown)] rounded-full hover:bg-[var(--rc-orange)] hover:text-white transition-colors font-medium"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
                <button className="w-full rounded-full bg-[var(--rc-espresso-brown)] text-white px-4 py-2 text-sm font-medium hover:bg-[var(--rc-orange)] transition-colors">
                  RSVP Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Events */}
      <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-8 text-[var(--rc-espresso-brown)]">Recent Events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastEvents.map((event) => (
            <div key={event.id} className="rounded-2xl bg-white shadow-lg ring-2 ring-[var(--rc-espresso-brown)]/10 overflow-hidden opacity-75">
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
                    Past Event
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-3 text-[var(--rc-espresso-brown)]">{event.title}</h3>
                <div className="text-sm text-[var(--rc-text-secondary)] mb-3 font-medium">
                  <div>{event.date} • {event.time}</div>
                </div>
                <p className="text-sm text-[var(--rc-text-secondary)] mb-3 font-medium">{event.description}</p>
                <div className="text-sm font-medium text-[var(--rc-text-secondary)] bg-gray-100 px-3 py-1 rounded">{event.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host Your Event */}
      <div className="mt-16 p-8 bg-white rounded-2xl border-2 border-[var(--rc-orange)]/20 shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-[var(--rc-espresso-brown)]">Host Your Event</h2>
        <p className="text-[var(--rc-text-secondary)] mb-6 font-medium text-lg">
          Want to host your own event at Rapchai? We offer flexible spaces for birthday parties, 
          corporate events, workshops, and more. Our team can help with catering and setup.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/catering"
            className="px-6 py-3 bg-[var(--rc-espresso-brown)] text-white rounded-full text-sm font-medium hover:bg-[var(--rc-orange)] transition-colors"
          >
            View Private Dining Options
          </a>
          <a
            href="/contact"
            className="px-6 py-3 border-2 border-[var(--rc-espresso-brown)] text-[var(--rc-espresso-brown)] rounded-full text-sm font-medium hover:bg-[var(--rc-espresso-brown)] hover:text-white transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}



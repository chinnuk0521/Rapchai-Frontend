"use client";
import { useState } from "react";
import RobustImage from "../../components/RobustImage";
import EventBookingModal from "../../components/EventBookingModal";
import { IMG } from "../../lib/images";
import { useEventsData } from "../../lib/hooks";
import { formatDateSSR, formatTimeRangeSSR } from "../../lib/ssr-utils";
import type { Event, Booking } from "../../lib/types";

export default function EventsPage() {
  const { events, loading, refetch } = useEventsData();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use API data only - no fallback to static data
  const displayEvents = events;

  const handleBookNow = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleBookingSuccess = (booking: Booking) => {
    // Optionally refresh events to show updated booking counts
    refetch();
  };

  const formatEventDate = (eventDate: string) => {
    return formatDateSSR(eventDate);
  };

  const formatEventTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'Music': return 'bg-red-500 text-white';
      case 'Community': return 'bg-blue-500 text-white';
      case 'Workshop': return 'bg-green-500 text-white';
      case 'Private': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Loading state
  if (loading.isLoading && events.length === 0) {
    return (
      <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
        <div className="w-[95%] mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--rc-orange)] mx-auto mb-4"></div>
              <p className="text-[var(--rc-text-secondary)]">Loading events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loading.error && events.length === 0) {
    return (
      <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
        <div className="w-[95%] mx-auto px-4">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-600 font-semibold mb-2">Failed to load events</p>
              <p className="text-red-500 text-sm mb-4">{loading.error}</p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const upcomingEvents = displayEvents.filter(e => e.status === "upcoming");
  const pastEvents = displayEvents.filter(e => e.status === "completed" || e.status === "cancelled");

  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <img src="/logo-brown.svg" alt="Logo" className="h-12 w-12 md:h-16 md:w-16" />
            <h1 className="text-5xl font-bold text-[var(--rc-espresso-brown)]">Events</h1>
          </div>
          <p className="text-xl text-[var(--rc-text-secondary)] max-w-4xl font-medium leading-relaxed">
            Join our vibrant community for rap music events, open mic nights, workshops, and more. 
            From freestyle battles to beat-making sessions, there's always something happening.
          </p>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-8 text-[var(--rc-orange)]">Upcoming Events</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-2xl bg-white shadow-lg ring-2 ring-[var(--rc-espresso-brown)]/10 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48">
                  <RobustImage
                    src={event.imageUrl || IMG.event}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.eventType)}`}>
                      {event.eventType}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-2">{event.title}</h3>
                  <p className="text-[var(--rc-text-secondary)] text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-[var(--rc-text-secondary)]">
                      <span className="font-semibold mr-2">📅</span>
                      {formatEventDate(event.eventDate)}
                    </div>
                    <div className="flex items-center text-sm text-[var(--rc-text-secondary)]">
                      <span className="font-semibold mr-2">🕐</span>
                      {formatEventTime(event.startTime, event.endTime)}
                    </div>
                    <div className="flex items-center text-sm text-[var(--rc-text-secondary)]">
                      <span className="font-semibold mr-2">💰</span>
                      {event.price || 'Free Entry'}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBookNow(event)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold rounded-lg hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {upcomingEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-2">No upcoming events</h3>
              <p className="text-[var(--rc-text-secondary)]">Check back soon for new events!</p>
            </div>
          )}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-8 text-[var(--rc-orange)]">Past Events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <div key={event.id} className="rounded-2xl bg-white shadow-lg ring-2 ring-[var(--rc-espresso-brown)]/10 overflow-hidden opacity-75">
                  <div className="relative h-48">
                    <RobustImage
                      src={event.imageUrl || IMG.event}
                      alt={event.title}
                      fill
                      className="object-cover grayscale"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      quality={85}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(event.eventType)}`}>
                        {event.eventType}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-2">{event.title}</h3>
                    <p className="text-[var(--rc-text-secondary)] text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-[var(--rc-text-secondary)]">
                        <span className="font-semibold mr-2">📅</span>
                        {formatEventDate(event.eventDate)}
                      </div>
                      <div className="flex items-center text-sm text-[var(--rc-text-secondary)]">
                        <span className="font-semibold mr-2">🕐</span>
                        {formatEventTime(event.startTime, event.endTime)}
                      </div>
                    </div>
                    <div className="text-center py-2 px-4 bg-gray-200 text-gray-600 font-bold rounded-lg">
                      Event Completed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Booking Modal */}
      <EventBookingModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
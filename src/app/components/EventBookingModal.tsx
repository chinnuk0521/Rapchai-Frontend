"use client";

import { useState, useEffect } from "react";
import { bookingApi } from "../lib/services";
import { formatDateSSR } from "../lib/ssr-utils";
import type { Event, Booking } from "../lib/types";

interface EventBookingModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (booking: Booking) => void;
}

type BookingStep = "form" | "payment" | "success";

export default function EventBookingModal({
  event,
  isOpen,
  onClose,
  onBookingSuccess,
}: EventBookingModalProps) {
  const [step, setStep] = useState<BookingStep>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState<Booking | null>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setName("");
      setMobile("");
      setQuantity(1);
      setError(null);
      setBooking(null);
    }
  }, [isOpen]);

  // Validate mobile number (10 digits, numeric only)
  const validateMobile = (mobile: string): boolean => {
    const cleaned = mobile.replace(/\D/g, "");
    return cleaned.length === 10;
  };

  // Format mobile number display
  const formatMobile = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.slice(0, 10);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobile(e.target.value);
    setMobile(formatted);
    setError(null);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(20, quantity + delta));
    setQuantity(newQuantity);
  };

  const calculateTotal = (): number => {
    if (!event || !event.price) return 0;
    // Extract numeric value from price string (e.g., "₹500" or "500")
    const priceStr = event.price.replace(/[₹,]/g, "").trim();
    const priceValue = parseFloat(priceStr) || 0;
    return priceValue * quantity;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!event) {
      setError("Event information is missing");
      return;
    }

    setIsSubmitting(true);
    setStep("payment");

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create booking
      // event.eventDate is actually the startAt ISO string from the API
      const bookingData = {
        eventId: event.id,
        name: name.trim(),
        phone: `+91${mobile}`, // Add country code
        email: undefined, // Optional
        partySize: quantity,
        date: event.eventDate, // This should be the ISO date string from startAt
        notes: `Payment reference: ${mobile}`,
      };

      const response = await bookingApi.createBooking(bookingData);
      const newBooking = response.booking;
      
      setBooking(newBooking);
      setStep("success");
      
      if (onBookingSuccess) {
        onBookingSuccess(newBooking);
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(
        err?.message || "Failed to create booking. Please try again."
      );
      setStep("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {step === "form" && "Book Event Ticket"}
            {step === "payment" && "Processing Payment"}
            {step === "success" && "Booking Confirmed!"}
          </h2>
          {step !== "payment" && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Form Step */}
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Event Details */}
              <div className="bg-[var(--rc-creamy-beige)] rounded-xl p-4 border-2 border-[var(--rc-espresso-brown)]/10">
                <h3 className="text-lg font-bold text-[var(--rc-espresso-brown)] mb-2">
                  {event.title}
                </h3>
                <div className="space-y-1 text-sm text-[var(--rc-text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">📅 Date:</span>
                    <span>{formatDateSSR(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🕐 Time:</span>
                    <span>
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">💰 Price:</span>
                    <span className="font-bold text-[var(--rc-orange)]">
                      {event.price || "Free Entry"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">
                  Number of Tickets <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg bg-[var(--rc-orange)] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--rc-espresso-brown)] transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-[var(--rc-espresso-brown)] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 20}
                    className="w-10 h-10 rounded-lg bg-[var(--rc-orange)] text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--rc-espresso-brown)] transition-colors"
                  >
                    +
                  </button>
                  {event.price && event.price !== "Free Entry" && (
                    <span className="ml-auto text-lg font-semibold text-[var(--rc-orange)]">
                      Total: ₹{calculateTotal()}
                    </span>
                  )}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:outline-none transition-colors font-medium text-[var(--rc-espresso-brown)]"
                  required
                />
              </div>

              {/* Mobile Input */}
              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--rc-text-secondary)] font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={handleMobileChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-16 pr-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/20 focus:border-[var(--rc-orange)] focus:outline-none transition-colors font-medium text-[var(--rc-espresso-brown)]"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--rc-text-secondary)]">
                  Used as UPI payment reference
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-600 font-semibold text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !validateMobile(mobile)}
                className="w-full py-4 px-6 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold rounded-xl hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Proceed to Pay
              </button>
            </form>
          )}

          {/* Payment Processing Step */}
          {step === "payment" && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--rc-orange)] mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-2">
                Processing Payment
              </h3>
              <p className="text-[var(--rc-text-secondary)] font-medium">
                Payment request sent to your UPI app linked with mobile number:
              </p>
              <p className="text-lg font-bold text-[var(--rc-orange)] mt-2">
                +91 {mobile}
              </p>
              <p className="text-sm text-[var(--rc-text-secondary)] mt-4">
                Please complete the payment in your UPI app...
              </p>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && booking && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-4">
                Your event ticket has been booked successfully!
              </h3>

              <div className="bg-[var(--rc-creamy-beige)] rounded-xl p-6 mt-6 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[var(--rc-text-secondary)]">
                    Event:
                  </span>
                  <span className="font-bold text-[var(--rc-espresso-brown)]">
                    {event.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[var(--rc-text-secondary)]">
                    Booking ID:
                  </span>
                  <span className="font-bold text-[var(--rc-orange)] font-mono">
                    {booking.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[var(--rc-text-secondary)]">
                    Mobile Number:
                  </span>
                  <span className="font-bold text-[var(--rc-espresso-brown)]">
                    +91 {mobile}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-[var(--rc-text-secondary)]">
                    Tickets:
                  </span>
                  <span className="font-bold text-[var(--rc-espresso-brown)]">
                    {quantity} {quantity === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
                {event.price && event.price !== "Free Entry" && (
                  <div className="flex justify-between items-center pt-2 border-t-2 border-[var(--rc-espresso-brown)]/10">
                    <span className="text-sm font-semibold text-[var(--rc-text-secondary)]">
                      Total Amount:
                    </span>
                    <span className="font-bold text-[var(--rc-orange)] text-lg">
                      ₹{calculateTotal()}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-6 py-4 px-6 bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white font-bold rounded-xl hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


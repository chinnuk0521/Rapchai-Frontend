"use client";
import { useState } from "react";
import Image from "next/image";
import { IMG } from "../../lib/images";

const packages = [
  {
    id: 1,
    name: "Starter Pack",
    price: "₹499",
    perPerson: "per person",
        description: "Perfect for casual gatherings and intimate occasions",
    features: [
      "Welcome drinks (Chai/Coffee/Juice)",
      "Mini burgers (Veg/Non-veg)",
      "Sandwiches & rolls",
      "Basic setup & service",
      "Up to 20 guests"
    ],
    popular: false,
    color: "bg-blue-50 border-blue-200"
  },
  {
    id: 2,
    name: "Signature",
    price: "₹799",
    perPerson: "per person", 
        description: "Our most popular package for memorable celebrations",
    features: [
      "Premium beverages & mocktails",
      "Signature mini burgers",
      "Gourmet sandwiches & wraps",
      "Fresh salads & soups",
      "Professional setup & service",
      "Up to 50 guests"
    ],
    popular: true,
    color: "bg-yellow-50 border-yellow-300"
  },
  {
    id: 3,
    name: "Premium",
    price: "₹1099",
    perPerson: "per person",
        description: "Luxury experience for special celebrations",
    features: [
      "Premium drinks & specialty coffees",
      "Chef's special mini burgers",
      "Gourmet sandwiches & artisanal rolls",
      "Fresh salads & premium soups",
      "Steak options (add-on)",
      "Full service & cleanup",
      "Up to 100 guests"
    ],
    popular: false,
    color: "bg-purple-50 border-purple-200"
  }
];

export default function CateringClient() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    guestCount: "",
    eventDate: "",
    package: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create WhatsApp message
      const message = `🍽️ *PRIVATE DINING ENQUIRY - RAPCHAI CAFÉ*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}

🎉 *Occasion Details:*
• Type: ${formData.eventType}
• Guests: ${formData.guestCount}
• Date: ${formData.eventDate}
• Package: ${formData.package}

💬 *Message:*
${formData.message}

---
*Sent from Rapchai Café Website*`;

    // Store the message and show success
    setWhatsappMessage(message);
    setShowSuccess(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        email: "",
        eventType: "",
        guestCount: "",
        eventDate: "",
        package: "",
        message: ""
      });
      setIsSubmitting(false);
      setShowSuccess(false);
    }, 5000);
  };

  return (
    <div className="py-12 bg-[var(--rc-creamy-beige)] min-h-screen">
      <div className="w-[95%] mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 text-[var(--rc-espresso-brown)]">
                Private Dining & 
                <span className="text-[var(--rc-orange)]"> Special Occasions</span>
              </h1>
              <p className="text-xl text-[var(--rc-text-secondary)] mb-8 leading-relaxed font-medium">
                Transform your special moments into unforgettable experiences with Rapchai's premium private dining services. 
                From intimate gatherings to grand celebrations, we bring the perfect blend of delicious food and exceptional service.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[var(--rc-text-secondary)]">
                  <div className="w-2 h-2 bg-[var(--rc-orange)] rounded-full"></div>
                  <span className="font-bold">Healthy Continental Menu</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--rc-text-secondary)]">
                  <div className="w-2 h-2 bg-[var(--rc-orange)] rounded-full"></div>
                  <span className="font-bold">Professional Service</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--rc-text-secondary)]">
                  <div className="w-2 h-2 bg-[var(--rc-orange)] rounded-full"></div>
                  <span className="font-bold">Flexible Packages</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src={IMG.interior}
                  alt="Rapchai Café Interior"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border-2 border-[var(--rc-orange)]/20">
                <div className="text-2xl font-bold text-[var(--rc-orange)]">50+</div>
                <div className="text-sm text-[var(--rc-text-secondary)] font-bold">Occasions Hosted</div>
              </div>
            </div>
          </div>
        </div>

      {/* Packages Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[var(--rc-espresso-brown)]">Dining Packages</h2>
          <p className="text-xl text-[var(--rc-text-secondary)] max-w-3xl mx-auto font-medium">
            Choose the perfect package for your special occasion. All packages include our signature healthy continental menu 
            and professional service team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className={`relative rounded-2xl border-2 p-8 ${pkg.color} ${pkg.popular ? 'ring-2 ring-[var(--rc-orange)] ring-offset-4' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[var(--rc-orange)] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[var(--rc-espresso-brown)] mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-[var(--rc-orange)] mb-1">{pkg.price}</div>
                <div className="text-[var(--rc-text-secondary)] font-bold">{pkg.perPerson}</div>
                <p className="text-[var(--rc-text-secondary)] mt-3 font-medium">{pkg.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[var(--rc-orange)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[var(--rc-text-secondary)] font-bold">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  pkg.popular
                    ? 'bg-[var(--rc-orange)] text-white hover:bg-[var(--rc-espresso-brown)]'
                    : 'bg-[var(--rc-espresso-brown)] text-white hover:bg-[var(--rc-orange)]'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, package: pkg.name }))}
              >
                Choose {pkg.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-[var(--rc-orange)]/20 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-[var(--rc-espresso-brown)]">Book Your Occasion</h2>
            <p className="text-xl text-[var(--rc-text-secondary)] font-medium">
              Ready to make your special occasion extraordinary? Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Occasion Type *</label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  required
                  aria-label="Occasion Type"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                >
                  <option value="">Select occasion type</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Wedding Reception">Wedding Reception</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Graduation Party">Graduation Party</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Private Celebration">Private Celebration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="guestCount" className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Number of Guests *</label>
                <select
                  id="guestCount"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                >
                  <option value="">Select guest count</option>
                  <option value="10-20">10-20 guests</option>
                  <option value="21-30">21-30 guests</option>
                  <option value="31-50">31-50 guests</option>
                  <option value="51-75">51-75 guests</option>
                  <option value="76-100">76-100 guests</option>
                  <option value="100+">100+ guests</option>
                </select>
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Event Date *</label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  placeholder="Select event date"
                  title="Select event date"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="package" className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Preferred Package</label>
                <select
                  id="package"
                  name="package"
                  value={formData.package}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors"
                >
                  <option value="">Select package</option>
                  <option value="Starter Pack - ₹499/person">Starter Pack - ₹499/person</option>
                  <option value="Signature - ₹799/person">Signature - ₹799/person</option>
                  <option value="Premium - ₹1099/person">Premium - ₹1099/person</option>
                  <option value="Custom Package">Custom Package</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--rc-espresso-brown)] mb-2">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--rc-espresso-brown)]/30 bg-white text-[var(--rc-espresso-brown)] placeholder-[var(--rc-text-muted)] focus:ring-2 focus:ring-[var(--rc-orange)] focus:border-[var(--rc-orange)] transition-colors resize-none"
                  placeholder="Tell us more about your special occasion, dietary requirements, or any questions you have..."
                />
              </div>
            </div>

            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white hover:from-[var(--rc-espresso-brown)] hover:to-[var(--rc-orange)] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Book Your Occasion
                  </span>
                )}
              </button>
              <p className="text-sm text-[var(--rc-text-secondary)] mt-4 font-medium">
                📱 Your enquiry will be processed and we'll contact you within 24 hours
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted Successfully!</h3>
                <p className="text-gray-700">Your private dining enquiry has been received. We'll contact you within 24 hours.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h4 className="font-bold text-gray-900 mb-3">WhatsApp Message Preview:</h4>
              <div className="bg-white border rounded-lg p-4 text-sm font-mono whitespace-pre-wrap text-gray-800">
                {whatsappMessage}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const encodedMessage = encodeURIComponent(whatsappMessage);
                  const whatsappUrl = `https://wa.me/918179299096?text=${encodedMessage}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                📱 Send to WhatsApp
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setIsSubmitting(false);
                }}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Why Choose Us Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[var(--rc-espresso-brown)]">Why Choose Rapchai?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[var(--rc-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--rc-orange)]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-3">Fresh & Healthy</h3>
            <p className="text-[var(--rc-text-secondary)] font-medium">All dishes prepared fresh with premium ingredients and healthy cooking methods.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[var(--rc-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--rc-orange)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-3">Professional Service</h3>
            <p className="text-[var(--rc-text-secondary)] font-medium">Experienced team ensures smooth execution and exceptional customer service.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-[var(--rc-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--rc-orange)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[var(--rc-espresso-brown)] mb-3">Flexible Packages</h3>
            <p className="text-[var(--rc-text-secondary)] font-medium">Customizable options to fit your budget and event requirements perfectly.</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}


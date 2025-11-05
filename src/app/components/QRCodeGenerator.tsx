"use client";
import { useState } from "react";

export default function QRCodeGenerator() {
  const [showQR, setShowQR] = useState(false);
  
  // In a real app, you would generate a proper QR code
  // For now, we'll show a placeholder
  const websiteUrl = typeof window !== 'undefined' ? `${window.location.origin}/order` : 'https://rapchai.vercel.app/order';

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => setShowQR(!showQR)}
        title="Show QR Code"
        aria-label="Show QR Code"
        className="bg-gradient-to-r from-[var(--rc-orange)] to-[var(--rc-espresso-brown)] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </button>

      {showQR && (
        <div className="absolute bottom-20 left-0 bg-white rounded-2xl shadow-2xl p-6 border-2 border-[var(--rc-orange)]/20">
          <div className="text-center">
            <h3 className="text-lg font-bold text-[var(--rc-espresso-brown)] mb-4">Scan to Order</h3>
            
            {/* QR Code Placeholder */}
            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <div className="text-sm text-gray-600 font-semibold">QR Code</div>
                <div className="text-xs text-gray-500 mt-1">Scan with camera</div>
              </div>
            </div>
            
            <div className="text-sm text-[var(--rc-text-secondary)] mb-4">
              <strong>Order Online:</strong><br />
              {websiteUrl}
            </div>
            
            <div className="space-y-2 text-xs text-[var(--rc-text-secondary)]">
              <div>• No app download required</div>
              <div>• Pay via UPI</div>
              <div>• Instant order confirmation</div>
            </div>
            
            <button
              onClick={() => setShowQR(false)}
              className="mt-4 px-4 py-2 bg-[var(--rc-orange)] text-white rounded-xl font-bold text-sm hover:bg-[var(--rc-espresso-brown)] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

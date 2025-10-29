"use client";

import { useState } from "react";

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  upiId: string;
}

const UPI_APPS = [
  {
    id: "phonepe",
    name: "PhonePe",
    icon: "📱",
    color: "from-purple-500 to-purple-600",
    deepLink: (upiId: string, amount: number) =>
      `phonepe://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://upi.phonepe.com/ctc?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
  },
  {
    id: "googlepay",
    name: "Google Pay",
    icon: "💳",
    color: "from-blue-500 to-blue-600",
    deepLink: (upiId: string, amount: number) =>
      `tez://upi/pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://gpay.app.goo.gl/pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: "💰",
    color: "from-blue-400 to-blue-500",
    deepLink: (upiId: string, amount: number) =>
      `paytmmp://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://paytm.me/${upiId}/${amount}`,
  },
  {
    id: "bhim",
    name: "BHIM UPI",
    icon: "🏦",
    color: "from-green-500 to-green-600",
    deepLink: (upiId: string, amount: number) =>
      `bhim://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://upi.npci.gov.in/pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
  },
  {
    id: "amazonpay",
    name: "Amazon Pay",
    icon: "📦",
    color: "from-orange-500 to-orange-600",
    deepLink: (upiId: string, amount: number) =>
      `amazonpay://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://amazon.in/pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
  },
  {
    id: "cred",
    name: "CRED",
    icon: "💎",
    color: "from-purple-600 to-purple-700",
    deepLink: (upiId: string, amount: number) =>
      `credpay://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://cred.club/upi/pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Pay",
    icon: "💬",
    color: "from-green-500 to-green-600",
    deepLink: (upiId: string, amount: number) =>
      `whatsapp://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://wa.me/pay/${upiId}?amount=${amount}`,
  },
  {
    id: "other",
    name: "Other UPI Apps",
    icon: "📲",
    color: "from-gray-500 to-gray-600",
    deepLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
    fallback: (upiId: string, amount: number) =>
      `https://upi.npci.gov.in/pay?pa=${upiId}&am=${amount}&cu=INR&tn=Rapchai%20Cafe%20Order`,
  },
];

export default function UPIPaymentModal({
  isOpen,
  onClose,
  amount,
  upiId,
}: UPIPaymentModalProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showManualUPI, setShowManualUPI] = useState(false);

  const handleAppSelect = (app: typeof UPI_APPS[0]) => {
    setSelectedApp(app.id);

    // Try deep link first
    try {
      window.location.href = app.deepLink(upiId, amount);
      
      // Fallback after a delay if deep link doesn't work
      setTimeout(() => {
        // Check if user is still on page (means deep link didn't work)
        if (window.document.visibilityState === 'visible') {
          window.open(app.fallback(upiId, amount), '_blank');
        }
      }, 2500);
    } catch (error) {
      // If deep link fails, use fallback URL
      window.open(app.fallback(upiId, amount), '_blank');
    }
  };

  const handleManualUPI = () => {
    setShowManualUPI(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[var(--rc-espresso-brown)]">
                Pay via UPI
              </h2>
              <p className="text-sm text-[var(--rc-text-secondary)] mt-1">
                Amount: <span className="font-bold text-[var(--rc-orange)]">₹{amount}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showManualUPI ? (
            /* Manual UPI Details */
            <div className="space-y-4">
              <div className="bg-[var(--rc-creamy-beige)] rounded-xl p-4 border-2 border-[var(--rc-orange)]">
                <div className="text-center">
                  <div className="text-3xl mb-3">💳</div>
                  <p className="text-sm text-[var(--rc-text-secondary)] mb-2">
                    Pay using any UPI app
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-[var(--rc-text-secondary)] mb-1">UPI ID</p>
                    <p className="text-lg font-bold text-[var(--rc-espresso-brown)] break-all">
                      {upiId}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200 mt-2">
                    <p className="text-xs text-[var(--rc-text-secondary)] mb-1">Amount</p>
                    <p className="text-lg font-bold text-[var(--rc-orange)]">
                      ₹{amount}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--rc-text-secondary)] mt-3">
                    Open your UPI app and enter these details manually
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowManualUPI(false)}
                className="w-full py-3 rounded-xl border-2 border-[var(--rc-orange)] text-[var(--rc-orange)] font-bold hover:bg-[var(--rc-orange)] hover:text-white transition-colors"
              >
                ← Back to App Selection
              </button>
            </div>
          ) : (
            /* UPI App Selection */
            <>
              <p className="text-[var(--rc-text-secondary)] text-center mb-6">
                Select your preferred UPI app to make payment
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {UPI_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppSelect(app)}
                    disabled={selectedApp === app.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 ${
                      selectedApp === app.id
                        ? `border-[var(--rc-orange)] bg-gradient-to-r ${app.color} text-white`
                        : "border-gray-200 hover:border-[var(--rc-orange)] bg-white"
                    }`}
                  >
                    <div className="text-3xl mb-2">{app.icon}</div>
                    <div className="font-bold text-sm">{app.name}</div>
                  </button>
                ))}
              </div>

              {selectedApp && (
                <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 text-center">
                    💡 Opening {UPI_APPS.find((a) => a.id === selectedApp)?.name}... 
                    <br />
                    If it doesn't open, check if the app is installed.
                  </p>
                </div>
              )}

              <button
                onClick={handleManualUPI}
                className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:border-[var(--rc-orange)] hover:text-[var(--rc-orange)] transition-colors"
              >
                📋 Enter UPI Details Manually
              </button>

              <div className="mt-4 p-3 bg-[var(--rc-creamy-beige)] rounded-xl text-center">
                <p className="text-xs text-[var(--rc-text-secondary)]">
                  <strong>UPI ID:</strong> {upiId}
                  <br />
                  <strong>Amount:</strong> ₹{amount}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


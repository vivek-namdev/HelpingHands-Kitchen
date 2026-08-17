// /frontend/src/components/common/FAQ.jsx

import { useState } from "react";
import { HelpCircle, X, ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is HelpingHands Kitchen?",
    a: "HelpingHands Kitchen is a smart food waste and donation platform that connects restaurants, hotels, and individuals who have surplus food with NGOs that can distribute it to those in need.",
  },
  {
    q: "How do I donate food?",
    a: "Register as a Donor, complete your profile, then click 'Create Donation' to list your surplus food with details like quantity, category and expiry time. NGOs will be notified automatically.",
  },
  {
    q: "How does an NGO claim a donation?",
    a: "NGOs can browse available donations on the Donations page, click 'Claim', and track pickup and delivery status in real time through the Claims page.",
  },
  {
    q: "What is the Priority system?",
    a: "Our data analytics team analyses each donation based on expiry time, quantity and nearby NGO availability. Donations are tagged HIGH, MEDIUM or LOW priority so NGOs act on urgent donations first.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All data is securely stored in MongoDB with JWT based authentication. Passwords are hashed with bcrypt and each user can only access data relevant to their role.",
  },
  {
    q: "What roles are available?",
    a: "There are three roles — Donor (restaurants, hotels, individuals who donate food), NGO (organisations that collect and distribute food), and Admin (manages the entire platform and views analytics).",
  },
];

const FAQ = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
      >
        <HelpCircle size={18} />
        <span>Help & FAQ</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-green-600 px-6 py-4">
          <div className="flex items-center gap-2 text-white">
            <HelpCircle size={20} />
            <h2 className="text-lg font-bold">Help & FAQ</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 text-white hover:bg-green-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        <div className="bg-green-50 px-6 py-3 border-b border-green-100">
          <p className="text-sm text-green-700">
            Everything you need to know about HelpingHands Kitchen
          </p>
        </div>

        {/* FAQ List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-100 transition"
              >
                <span>{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp
                    size={16}
                    className="text-green-600 shrink-0 ml-2"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="text-gray-400 shrink-0 ml-2"
                  />
                )}
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            Still need help? Contact your admin or team lead.
          </p>
        </div>
      </div>
    </>
  );
};

export default FAQ;

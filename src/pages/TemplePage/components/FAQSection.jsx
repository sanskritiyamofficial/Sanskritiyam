import React, { useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Default FAQs if none provided
  const defaultFAQs = [
    {
      question: "How to book a puja service?",
      answer: "Easily book a puja by visiting our website. Simply fill in your name and Gotra, make the payment, and the puja service will be booked."
    },
    {
      question: "What if I don't know my Gotra?",
      answer: "If you don't know your Gotra, please enter 'Kashyap' as your Gotra while booking the puja."
    },
    {
      question: "How to make a payment?",
      answer: "Making a payment is very simple. You can easily pay online through the secure payment options available on our website. Use options like Debit card, Credit card, or UPI as per your convenience, and book the puja service instantly."
    },
    {
      question: "How will I know the puja has been performed in my name?",
      answer: "Yes, you will be able to watch the puja through a video call, and after the puja is completed, a video of the puja will be sent to you on WhatsApp, along with the prasad delivered to your provided address."
    },
    {
      question: "Will I receive a video of the puja?",
      answer: "Yes, once the puja is completed, a video of the puja will be shared with you on WhatsApp."
    },
    {
      question: "What do I need to prepare for the puja?",
      answer: "No special preparation is needed for the puja; the priest will guide you through all the rituals."
    }
  ];


  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {defaultFAQs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>{faq.question}</span>
                <span className={`transform transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}>
                  <FaArrowDown />
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 text-gray-600 border-t">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

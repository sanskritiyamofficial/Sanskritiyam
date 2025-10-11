import React, { useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { useLanguage } from "../../../contexts/LanguageContext";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { language } = useLanguage();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Default FAQs if none provided
  const defaultFAQs = [
    {
      question: {
        en: "How to book a puja service?",
        hi: "पूजा सेवा कैसे बुक करें?",
      },
      answer: {
        en: "Easily book a puja by visiting our website. Simply fill in your name and Gotra, make the payment, and the puja service will be booked.",
        hi: "हमारी वेबसाइट पर जाकर आसानी से पूजा बुक करें। बस अपना नाम और गोत्र भरें, भुगतान करें, और पूजा सेवा बुक हो जाएगी।",
      },
    },
    {
      question: {
        en: "What if I don't know my Gotra?",
        hi: "यदि मुझे अपना गोत्र नहीं पता है तो क्या करूं?",
      },
      answer: {
        en: "If you don't know your Gotra, please enter 'Bhardwaj' as your Gotra while booking the puja.",
        hi: "यदि आपको अपना गोत्र नहीं पता है, तो पूजा बुक करते समय कृपया 'भारद्वाज' को अपने गोत्र के रूप में दर्ज करें।",
      },
    },
    {
      question: {
        en: "How to make a payment?",
        hi: "भुगतान कैसे करें?",
      },
      answer: {
        en: "Making a payment is very simple. You can easily pay online through the secure payment options available on our website. Use options like Debit card, Credit card, or UPI as per your convenience, and book the puja service instantly.",
        hi: "भुगतान करना बहुत आसान है। आप हमारी वेबसाइट पर उपलब्ध सुरक्षित भुगतान विकल्पों के माध्यम से आसानी से ऑनलाइन भुगतान कर सकते हैं। अपनी सुविधा के अनुसार डेबिट कार्ड, क्रेडिट कार्ड, या UPI जैसे विकल्पों का उपयोग करें, और तुरंत पूजा सेवा बुक करें।",
      },
    },
    {
      question: {
        en: "How will I know the puja has been performed in my name?",
        hi: "मुझे कैसे पता चलेगा कि पूजा मेरे नाम से की गई है?",
      },
      answer: {
        en: "Yes, you will be able to watch the puja through a video call, and after the puja is completed, a video of the puja will be sent to you on WhatsApp, along with the prasad delivered to your provided address.",
        hi: "हां, आप वीडियो कॉल के माध्यम से पूजा देख सकेंगे, और पूजा पूरी होने के बाद, पूजा का वीडियो आपको व्हाट्सऐप पर भेजा जाएगा, साथ ही प्रसाद आपके दिए गए पते पर पहुंचाया जाएगा।",
      },
    },
    {
      question: {
        en: "Will I receive a video of the puja?",
        hi: "क्या मुझे पूजा का वीडियो मिलेगा?",
      },
      answer: {
        en: "Yes, once the puja is completed, a video of the puja will be shared with you on WhatsApp.",
        hi: "हां, पूजा पूरी होने के बाद, पूजा का वीडियो आपके साथ व्हाट्सऐप पर साझा किया जाएगा।",
      },
    },
    {
      question: {
        en: "What do I need to prepare for the puja?",
        hi: "पूजा के लिए मुझे क्या तैयारी करनी होगी?",
      },
      answer: {
        en: "No special preparation is needed for the puja; the priest will guide you through all the rituals.",
        hi: "पूजा के लिए किसी विशेष तैयारी की आवश्यकता नहीं है; पंडित जी आपको सभी अनुष्ठानों के माध्यम से मार्गदर्शन करेंगे।",
      },
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          {language === "hi"
            ? "अक्सर पूछे जाने वाले प्रश्न"
            : "Frequently Asked Questions"}
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {defaultFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition flex justify-between items-center"
              >
                <span>{faq.question[language]}</span>
                <span
                  className={`transform transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <FaArrowDown />
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 text-gray-600 border-t">
                  {faq.answer[language]}
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

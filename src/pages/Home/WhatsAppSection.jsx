import React from 'react';

const WhatsAppSection = () => {
  const socialLinks = [
    {
      href: "https://www.facebook.com/sanskritiyam",
      icon: "/assets/img/landing-page/facebook.png",
      count: "10K+"
    },
    {
      href: "https://www.youtube.com/@Sanskritiyam",
      icon: "/assets/img/landing-page/youtube.png",
      count: "2K+"
    },
    {
      href: "https://www.instagram.com/sanskritiyam",
      icon: "/assets/img/landing-page/instagram.jpeg",
      count: "1K+"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-full hover:bg-gray-200 transition"
            >
              <img
                src={link.icon}
                alt={`${link.href.split('//')[1].split('.')[0]} Icon`}
                className="h-6 w-6"
              />
              <span className="font-medium">{link.count}</span>
            </a>
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            📲 Join Sanskritiyam Puja WhatsApp
          </h2>
          <p className="text-gray-600 mb-8">
            Join Sanskritiyam for daily Darshan, LIVE Puja updates, and receive
            blessings directly on WhatsApp.
          </p>
          <a
            href="https://whatsapp.com/channel/0029Vb6WHm7KQuJMvDCVwh2a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition"
          >
            Join Sanskritiyam Puja 💬
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatsAppSection;

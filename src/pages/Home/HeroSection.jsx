import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = document.getElementById('omSound');
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="pt-12 sm:pt-0 bg-gradient-to-b from-orange-50 to-white min-h-screen flex items-center">
      <div className="mx-auto px-4 sm:px-6 lg:px-18 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16">
          {/* Content Section */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
            {/* Om Section */}
            <div className="mb-6 md:mb-8 flex flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4">
              <div href="" className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <img
                  src="/assets/img/om1.png"
                  alt="Om Symbol"
                  className="h-6 sm:h-8 md:h-10 lg:h-12 flex-shrink-0"
                />
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 text-center sm:text-left">
                  Om is the sound of the universe
                </h2>
              </div>
              <audio
                id="omSound"
                src="/assets/audio/aum_02_528hz-22432.mp3"
                preload="auto"
              ></audio>
              <button
                onClick={toggleAudio}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 hover:bg-orange-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 flex-shrink-0 mt-2 sm:mt-0"
                aria-label={isPlaying ? 'Mute Om sound' : 'Play Om sound'}
              >
                {isPlaying ? <FaVolumeMute className="text-orange-600 text-xs sm:text-lg md:text-xl" /> : <FaVolumeUp className="text-orange-600 text-xs sm :text-lg md:text-xl" />}
              </button>
            </div>

            {/* Main Heading */}
            <div className="mb-4 md:mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-orange-600 mb-3 md:mb-4 leading-tight">
                Sanskritiyam
              </h1>
              <div className="space-y-1 md:space-y-2">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-gray-700 leading-relaxed">
                  A Trusted Spiritual Platform for Offering
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-gray-700 leading-relaxed">
                  Puja and Chadhavas at India's
                </p>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-normal text-gray-700 leading-relaxed">
                  Most Famous Mandir
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 md:mb-8 lg:mb-10 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-full sm:max-w-2xl mx-auto lg:mx-0">
              Experience live darshan, participate in online pujas, and receive
              sacred prasad from India's most revered temples
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center lg:justify-start items-center">
              <Link to="/pooja-booking" className="w-full sm:w-auto">
                <button className="bg-gradient-to-r cursor-pointer from-orange-500 to-orange-600 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto hover:scale-105 transform">
                  Book Pujas
                </button>
              </Link>
              <Link to="/chadhawa" className="w-full sm:w-auto">
                <button className="bg-gray-900 hover:bg-gray-800 cursor-pointer text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-4 rounded-full hover:shadow-xl transition-all duration-300 text-sm sm:text-base md:text-lg font-semibold w-full sm:w-auto hover:scale-105 transform">
                  Book Chadhavas
                </button>
              </Link>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] xl:h-[500px] max-w-sm sm:max-w-md lg:max-w-none mx-auto">
              <img
                src="/assets/img/family-sits-table-with-sign-that-says-god.jpg"
                alt="Temple worship scene"
                className="w-full h-full object-cover rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
              />
              {/* Floating Video */}
              <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 md:-bottom-4 md:-right-4 lg:-bottom-6 lg:-right-6 bg-white rounded-xl shadow-lg">
                <video 
                  className="h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 rounded-lg" 
                  autoPlay 
                  loop 
                  muted
                  playsInline
                >
                  <source src="/assets/video/video (1).mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

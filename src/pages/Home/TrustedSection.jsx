import { trustedData } from "./Data/Data";

const TrustedSection = () => {
  return (
    <section className="mt-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-md md:text-4xl font-bold text-orange-600 mb-4">
            <span className="text-md">🙏</span> Where Faith and Service Meet
            <span className="text-md">🙏</span>
          </h2>
          <p className="text-xl text-orange-600 font-medium">
            Highest Rated Devotional Platform
          </p>
        </div>

        <div className="flex flex-row overflow-x-auto md:grid md:grid-cols-3 gap-8">
          {trustedData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow min-w-[300px] md:min-w-0"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full mx-auto mb-4 object-cover rounded-lg"
              />
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedSection;

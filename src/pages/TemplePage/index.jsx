import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TempleHeader,
  TempleDescription,
  BenefitsSection,
  PujaPackages,
  TempleInfo,
  ProcessSection,
  FAQSection,
  TestimonialsSection
} from './components';
import { getTemplePageData } from './Data/templePageData';
import { getTempleDataByLanguage } from '../../data/templeDataBilingual';
import { useLanguage } from '../../contexts/LanguageContext';

const TemplePage = () => {
  const { templeId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [templeData, setTempleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get bilingual data first, fall back to old data if not available
    let data = getTempleDataByLanguage(templeId, language);
    
    // If bilingual data doesn't exist, fallback to original data structure
    if (!data) {
      data = getTemplePageData(templeId);
    }
    
    if (data) {
      setTempleData(data);
      setLoading(false);
    } else {
      // Redirect to 404 or home page if temple not found
      navigate('/');
    }
  }, [templeId, language, navigate]);

  const handleSelectPackage = () => {
    // Scroll to packages section
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePackageSelect = (pkg) => {
    // Store package data and redirect to offerings page
    localStorage.setItem('selectedPackage', JSON.stringify(pkg));
    localStorage.setItem('templeData', JSON.stringify(templeData));
    navigate(`/temple/${templeId}/offerings`, { 
      state: { selectedPackage: pkg } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading temple information...</p>
        </div>
      </div>
    );
  }

  if (!templeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Temple Not Found</h1>
          <p className="text-gray-600 mb-8">The temple you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Temple Header */}
      <TempleHeader 
        templeData={templeData} 
        onSelectPackage={handleSelectPackage}
      />

      {/* Temple Description */}
      <TempleDescription templeData={templeData} />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Puja Packages */}
      <div id="packages-section">
        <PujaPackages 
          packages={templeData.packages} 
          onPackageSelect={handlePackageSelect}
        />
      </div>

      {/* Temple Information */}
      <TempleInfo templeData={templeData} />

      {/* Process Section */}
      <ProcessSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
};

export default TemplePage;

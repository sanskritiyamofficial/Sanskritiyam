import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getTemplePageData } from './Data/templePageData';
import TempleOfferings from '../../components/TempleOfferings';

const TempleOfferingsPage = () => {
  const { templeId } = useParams();
  const location = useLocation();
  const [templeData, setTempleData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    // Get temple data
    const temple = getTemplePageData(templeId);
    if (temple) {
      setTempleData(temple);
    }

    // Get selected package from location state or localStorage
    const packageData = location.state?.selectedPackage || 
      JSON.parse(localStorage.getItem('selectedPackage') || 'null');
    
    if (packageData) {
      setSelectedPackage(packageData);
    } else {
      // If no package selected, redirect back to temple page
      window.history.back();
    }
  }, [templeId, location.state]);

  if (!templeData || !selectedPackage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading temple offerings...</p>
        </div>
      </div>
    );
  }

  return (
    <TempleOfferings 
      templeData={templeData} 
      selectedPackage={selectedPackage} 
    />
  );
};

export default TempleOfferingsPage;

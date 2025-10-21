import React from 'react';
import PropertyCard from './PropertyCard'; // Reuse the existing card

const SimilarProperties = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return null; // Don't render anything if no similar properties found
  }

  return (
    <div> {/* Removed mt-12, margin is handled by parent now */}
      <h2 className="text-2xl font-semibold mb-6">Similar Listings Nearby</h2>
      {/* --- THIS IS THE CHANGE --- */}
      {/* Use horizontal grid that wraps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* --- END CHANGE --- */}
        {properties.map(prop => (
          <PropertyCard key={prop._id} property={prop} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
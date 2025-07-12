import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [location, setLocation] = useState({
    latitude: initialLocation?.latitude || '',
    longitude: initialLocation?.longitude || '',
    address: initialLocation?.address || '',
    city: initialLocation?.city || '',
    state: initialLocation?.state || '',
    country: initialLocation?.country || '',
    postal_code: initialLocation?.postal_code || ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Use OpenStreetMap Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const result = data[0];
        const newLocation = {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          address: result.display_name.split(',')[0] || '',
          city: result.address?.city || result.address?.town || result.address?.village || '',
          state: result.address?.state || '',
          country: result.address?.country || '',
          postal_code: result.address?.postcode || ''
        };
        
        setLocation(newLocation);
        onLocationSelect(newLocation);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = () => {
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
      </div>
      
      {/* Search Location */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
        />
        <button
          onClick={searchLocation}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Location Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={location.latitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., 40.7128"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={location.longitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., -74.0060"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={location.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Street address"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={location.city}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="City"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province *
          </label>
          <input
            type="text"
            name="state"
            value={location.state}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="State or Province"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country *
          </label>
          <input
            type="text"
            name="country"
            value={location.country}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Country"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code *
          </label>
          <input
            type="text"
            name="postal_code"
            value={location.postal_code}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Postal Code"
            required
          />
        </div>
      </div>

      {/* Map Preview */}
      {location.latitude && location.longitude && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Preview
          </label>
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude-0.01},${location.latitude-0.01},${location.longitude+0.01},${location.latitude+0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker; 
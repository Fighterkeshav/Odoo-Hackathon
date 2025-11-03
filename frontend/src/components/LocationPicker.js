import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import LocationService from '../services/locationService';

const LocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [location, setLocation] = useState({
    latitude: initialLocation?.latitude || '',
    longitude: initialLocation?.longitude || '',
    city: initialLocation?.city || '',
    country: initialLocation?.country || ''
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  useEffect(() => {
    if (!location.city || !location.country || !location.latitude || !location.longitude) {
      detectLocation();
    }
    // eslint-disable-next-line
  }, []);

  const detectLocation = () => {
    setGeoLoading(true);
    setGeoError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const results = await LocationService.reverseGeocode(latitude, longitude);
          
          // Extract city and country from address components
          let city = '';
          let country = '';
          
          if (results.details) {
            // Handle Google Maps response
            if (Array.isArray(results.details)) {
              results.details.forEach(component => {
                if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                  city = component.long_name;
                }
                if (component.types.includes('country')) {
                  country = component.long_name;
                }
              });
            }
            // Handle Nominatim response
            else if (typeof results.details === 'object') {
              city = results.details.city || results.details.town || results.details.village || results.details.county || '';
              country = results.details.country || '';
            }
          }
          
          setLocation({
            latitude,
            longitude,
            city,
            country
          });
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setGeoError('Could not detect city/country from your location.');
        }
        setGeoLoading(false);
      }, (err) => {
        setGeoError('Location access denied or unavailable.');
        setGeoLoading(false);
      });
    } else {
      setGeoError('Geolocation is not supported by your browser.');
      setGeoLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = () => {
    if (!location.city || !location.country || !location.latitude || !location.longitude) {
      alert('Please provide at least your city, country, and allow location access.');
      return;
    }
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
      </div>
      {geoLoading && <div className="text-blue-600">Detecting your location...</div>}
      {geoError && <div className="text-red-600">{geoError}</div>}
      <button
        onClick={detectLocation}
        className="px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700"
        disabled={geoLoading}
      >
        Detect My Location
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City *</label>
          <input
            type="text"
            name="city"
            value={location.city}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country *</label>
          <input
            type="text"
            name="country"
            value={location.country}
            onChange={handleInputChange}
            className="input-field"
            required
          />
        </div>
      </div>
      <button
        onClick={handleLocationSelect}
        className="btn-primary w-full mt-4"
        disabled={geoLoading}
      >
        Save Location
      </button>
    </div>
  );
};

export default LocationPicker; 
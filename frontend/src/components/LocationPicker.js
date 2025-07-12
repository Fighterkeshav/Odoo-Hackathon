import React, { useState, useEffect } from 'react';
import { MapPin, Search, Building, Home, Store, Coffee, GraduationCap, Heart, CreditCard, Car } from 'lucide-react';
import LocationService from '../services/locationService';

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
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('combined'); // 'nominatim', 'overpass', or 'combined'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'coffee':
        return <Coffee className="h-4 w-4" />;
      case 'store':
        return <Store className="h-4 w-4" />;
      case 'building':
        return <Building className="h-4 w-4" />;
      case 'graduation-cap':
        return <GraduationCap className="h-4 w-4" />;
      case 'heart':
        return <Heart className="h-4 w-4" />;
      case 'credit-card':
        return <CreditCard className="h-4 w-4" />;
      case 'car':
        return <Car className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setSearchResults([]);
    
    try {
      let results = [];
      
      switch (searchType) {
        case 'nominatim':
          results = await LocationService.searchNominatim(searchQuery, 5);
          break;
        case 'overpass':
          results = await LocationService.searchOverpass(searchQuery, 5);
          break;
        case 'combined':
        default:
          results = await LocationService.searchCombined(searchQuery, 3);
          break;
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching location:', error);
      // Fallback to Nominatim if Overpass fails
      if (searchType === 'overpass' || searchType === 'combined') {
        try {
          const fallbackResults = await LocationService.searchNominatim(searchQuery, 5);
          setSearchResults(fallbackResults);
        } catch (fallbackError) {
          console.error('Fallback search also failed:', fallbackError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectLocation = (result) => {
    const newLocation = {
      latitude: result.latitude,
      longitude: result.longitude,
      address: result.address || result.name.split(',')[0] || '',
      city: result.city || result.address?.city || result.address?.town || result.address?.village || '',
      state: result.state || result.address?.state || '',
      country: result.country || result.address?.country || '',
      postal_code: result.postal_code || result.address?.postcode || ''
    };
    
    setLocation(newLocation);
    setSearchResults([]);
    setSearchQuery(result.name);
    onLocationSelect(newLocation);
  };

  const handleLocationSelect = () => {
    onLocationSelect(location);
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'nominatim':
        return "Search for a location, city, or address...";
      case 'overpass':
        return "Search for places, shops, restaurants, offices...";
      case 'combined':
      default:
        return "Search for anything - locations, places, businesses...";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MapPin className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
      </div>
      
      {/* Search Type Toggle */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setSearchType('combined')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            searchType === 'combined'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Combined
        </button>
        <button
          onClick={() => setSearchType('nominatim')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            searchType === 'nominatim'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setSearchType('overpass')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            searchType === 'overpass'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          POI Search
        </button>
      </div>
      
      {/* Search Location */}
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border border-gray-200 rounded-md max-h-48 overflow-y-auto">
          {searchResults.map((result) => (
            <button
              key={`${result.source}_${result.id}`}
              onClick={() => selectLocation(result)}
              className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
            >
              {getIconComponent(result.icon)}
              <div className="flex-1">
                <div className="font-medium text-gray-900">{result.name}</div>
                <div className="text-sm text-gray-500">
                  {result.type !== 'location' && <span className="capitalize">{result.type}</span>}
                  {result.address && ` • ${result.address}`}
                  {result.source && <span className="text-xs text-gray-400 ml-2">({result.source})</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

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
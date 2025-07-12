// Location Service for handling Nominatim and Overpass Turbo APIs

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// Cache for search results
const searchCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class LocationService {
  // Nominatim search for general locations
  static async searchNominatim(query, limit = 5) {
    const cacheKey = `nominatim_${query}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error(`Nominatim API error: ${response.status}`);
      }

      const data = await response.json();
      
      const results = data.map(result => ({
        id: result.place_id,
        name: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        type: 'location',
        address: result.address,
        icon: 'map-pin',
        source: 'nominatim'
      }));

      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Nominatim search error:', error);
      throw error;
    }
  }

  // Overpass Turbo search for POIs and detailed locations
  static async searchOverpass(query, limit = 10) {
    const cacheKey = `overpass_${query}_${limit}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Search for various POI types
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["name"~"${query}", i]["amenity"];
          node["name"~"${query}", i]["shop"];
          node["name"~"${query}", i]["office"];
          node["name"~"${query}", i]["leisure"];
          node["name"~"${query}", i]["tourism"];
          way["name"~"${query}", i]["amenity"];
          way["name"~"${query}", i]["shop"];
          way["name"~"${query}", i]["office"];
          way["name"~"${query}", i]["leisure"];
          way["name"~"${query}", i]["tourism"];
          relation["name"~"${query}", i]["amenity"];
          relation["name"~"${query}", i]["shop"];
          relation["name"~"${query}", i]["office"];
          relation["name"~"${query}", i]["leisure"];
          relation["name"~"${query}", i]["tourism"];
        );
        out center ${limit};
      `;

      const response = await fetch(OVERPASS_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      
      const results = data.elements.map(element => {
        const center = element.center || element;
        const tags = element.tags || {};
        
        return {
          id: element.id,
          name: tags.name || 'Unnamed location',
          latitude: center.lat,
          longitude: center.lon,
          type: tags.amenity || tags.shop || tags.office || tags.leisure || tags.tourism || 'poi',
          address: this.formatAddress(tags),
          city: tags['addr:city'] || '',
          state: tags['addr:state'] || '',
          country: tags['addr:country'] || '',
          postal_code: tags['addr:postcode'] || '',
          icon: this.getIconForType(tags.amenity || tags.shop || tags.office || tags.leisure || tags.tourism),
          source: 'overpass'
        };
      });

      this.setCache(cacheKey, results);
      return results;
    } catch (error) {
      console.error('Overpass search error:', error);
      throw error;
    }
  }

  // Combined search using both APIs
  static async searchCombined(query, limit = 5) {
    try {
      const [nominatimResults, overpassResults] = await Promise.allSettled([
        this.searchNominatim(query, limit),
        this.searchOverpass(query, limit)
      ]);

      const results = [];
      
      if (nominatimResults.status === 'fulfilled') {
        results.push(...nominatimResults.value);
      }
      
      if (overpassResults.status === 'fulfilled') {
        results.push(...overpassResults.value);
      }

      // Remove duplicates and sort by relevance
      const uniqueResults = this.removeDuplicates(results);
      return uniqueResults.slice(0, limit * 2);
    } catch (error) {
      console.error('Combined search error:', error);
      throw error;
    }
  }

  // Reverse geocoding
  static async reverseGeocode(latitude, longitude) {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`
      );
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding error: ${response.status}`);
      }

      const data = await response.json();
      return {
        address: data.display_name,
        details: data.address,
        latitude: parseFloat(data.lat),
        longitude: parseFloat(data.lon)
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Get nearby POIs
  static async getNearbyPOIs(latitude, longitude, radius = 1000, types = ['amenity', 'shop']) {
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"](around:${radius},${latitude},${longitude});
          node["shop"](around:${radius},${latitude},${longitude});
          way["amenity"](around:${radius},${latitude},${longitude});
          way["shop"](around:${radius},${latitude},${longitude});
        );
        out center;
      `;

      const response = await fetch(OVERPASS_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!response.ok) {
        throw new Error(`Nearby POIs error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.elements.map(element => {
        const center = element.center || element;
        const tags = element.tags || {};
        
        return {
          id: element.id,
          name: tags.name || 'Unnamed POI',
          latitude: center.lat,
          longitude: center.lon,
          type: tags.amenity || tags.shop || 'poi',
          distance: this.calculateDistance(latitude, longitude, center.lat, center.lon)
        };
      }).sort((a, b) => a.distance - b.distance);
    } catch (error) {
      console.error('Get nearby POIs error:', error);
      throw error;
    }
  }

  // Helper methods
  static formatAddress(tags) {
    const parts = [];
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    return parts.join(' ').trim();
  }

  static getIconForType(type) {
    switch (type) {
      case 'restaurant':
      case 'cafe':
      case 'bar':
        return 'coffee';
      case 'shop':
      case 'supermarket':
      case 'convenience':
        return 'store';
      case 'office':
      case 'company':
        return 'building';
      case 'school':
      case 'university':
        return 'graduation-cap';
      case 'hospital':
      case 'clinic':
        return 'heart';
      case 'bank':
        return 'credit-card';
      case 'parking':
        return 'car';
      default:
        return 'map-pin';
    }
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static removeDuplicates(results) {
    const seen = new Set();
    return results.filter(result => {
      const key = `${result.latitude},${result.longitude}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Cache methods
  static getFromCache(key) {
    const cached = searchCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    searchCache.delete(key);
    return null;
  }

  static setCache(key, data) {
    searchCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  static clearCache() {
    searchCache.clear();
  }
}

export default LocationService; 
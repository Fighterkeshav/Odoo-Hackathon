import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Filter, Grid, List, MapPin, User } from 'lucide-react';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    condition: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const sizes = [
    { value: '', label: 'All Sizes' },
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'One Size', label: 'One Size' }
  ];

  const conditions = [
    { value: '', label: 'All Conditions' },
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/items?${params}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getConditionColor = (condition) => {
    const colors = {
      new: 'bg-green-100 text-green-800',
      'like-new': 'bg-blue-100 text-blue-800',
      good: 'bg-yellow-100 text-yellow-800',
      fair: 'bg-orange-100 text-orange-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      tops: '👕',
      bottoms: '👖',
      dresses: '👗',
      outerwear: '🧥',
      shoes: '👟',
      accessories: '👜'
    };
    return icons[category] || '👕';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Items</h1>
        <p className="text-gray-600">Discover sustainable fashion from our community</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              className="input-field"
            >
              {sizes.map(size => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="input-field"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {items.length} item{items.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Items Grid/List */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👕</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={viewMode === 'grid' ? 'card-hover block' : 'card-hover block'}
            >
              {viewMode === 'grid' ? (
                <div>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                    {item.image_url ? (
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.size}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{item.owner.name}</span>
                      {item.owner.location && (
                        <>
                          <span className="mx-1">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{item.owner.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl">
                        {getCategoryIcon(item.category)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{item.size}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{item.owner.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsPage; 
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Filter, Grid, List, MapPin, User } from 'lucide-react';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_id: '',
    size_id: '',
    condition_id: '',
    tag_id: '',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    // Fetch filter options from backend
    const fetchMeta = async () => {
      const [catRes, sizeRes, condRes, tagRes] = await Promise.all([
        axios.get('/api/meta/categories'),
        axios.get('/api/meta/sizes'),
        axios.get('/api/meta/conditions'),
        axios.get('/api/meta/tags')
      ]);
      setCategories(catRes.data);
      setSizes(sizeRes.data);
      setConditions(condRes.data);
      setTags(tagRes.data);
    };
    fetchMeta();
    
    // Initial fetch of items
    fetchItems();
  }, []);

  useEffect(() => {
    // Only fetch items when non-search filters change
    if (filters.category_id || filters.size_id || filters.condition_id || filters.tag_id) {
      fetchItems();
    }
  }, [filters.category_id, filters.size_id, filters.condition_id, filters.tag_id]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

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

  const handleSearchChange = (value) => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Update the search filter immediately for UI responsiveness
    setFilters(prev => ({
      ...prev,
      search: value
    }));

    // Set a new timeout to fetch items after 500ms of no typing
    const timeout = setTimeout(() => {
      fetchItems();
    }, 500);

    setSearchTimeout(timeout);
  };

  const getConditionColor = (condition) => {
    const colors = {
      'New': 'bg-green-100 text-green-800',
      'Like New': 'bg-blue-100 text-blue-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800',
      'Poor': 'bg-red-100 text-red-800'
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          <div>
            <select
              value={filters.size_id}
              onChange={(e) => handleFilterChange('size_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Sizes</option>
              {sizes.map(size => (
                <option key={size.id} value={size.id}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <select
              value={filters.condition_id}
              onChange={(e) => handleFilterChange('condition_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Conditions</option>
              {conditions.map(condition => (
                <option key={condition.id} value={condition.id}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <select
              value={filters.tag_id}
              onChange={(e) => handleFilterChange('tag_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Tags</option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
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
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${item.images[0].image_url}`}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">
                        {getCategoryIcon(item.category?.name)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.size?.label}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition?.label)}`}>
                        {item.condition?.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>{item.owner?.name}</span>
                      {item.owner?.city && item.owner?.country && (
                        <>
                          <span className="mx-1">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{item.owner.city}, {item.owner.country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${item.images[0].image_url}`}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-2xl">
                        {getCategoryIcon(item.category?.name)}
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
                        <span>{item.size?.label}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition?.label)}`}>
                          {item.condition?.label}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{item.owner?.name}</span>
                        {item.owner?.city && item.owner?.country && (
                          <>
                            <span className="mx-1">•</span>
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{item.owner.city}, {item.owner.country}</span>
                          </>
                        )}
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
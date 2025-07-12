import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Gift, 
  Coins,
  MessageCircle,
  Heart
} from 'lucide-react';
import WishlistButton from '../components/WishlistButton';

const ItemDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swapLoading, setSwapLoading] = useState(false);

  // Gallery state for images
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item details');
      navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async (type) => {
    if (!user) {
      toast.error('Please login to request items');
      navigate('/login');
      return;
    }

    if (item.owner_id === user.id) {
      toast.error('You cannot request your own item');
      return;
    }

    if (type === 'redeem' && user.points < 1) {
      toast.error('You need at least 1 point to redeem items');
      return;
    }

    try {
      setSwapLoading(true);
      await axios.post('/api/swap', {
        item_id: item.id,
        type: type
      });
      
      toast.success(`${type === 'redeem' ? 'Redemption' : 'Swap'} request sent successfully!`);
      fetchItem(); // Refresh item data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send request';
      toast.error(message);
    } finally {
      setSwapLoading(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/items')}
            className="btn-primary"
          >
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  // Helper to get image URLs
  const images = item.images && item.images.length > 0 ? item.images : [];
  const tags = item.tags || [];
  const category = item.category ? item.category.name : '';
  const size = item.size ? item.size.label : '';
  const condition = item.condition ? item.condition.label : '';
  const type = item.type || '';
  const status = item.status || '';
  const owner = item.owner || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/items')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Items
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Section */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 flex items-center justify-center">
            {images.length > 0 ? (
              <img
                src={`http://localhost:5000${images[currentImage].image_url}`}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-8xl">
                👕
              </div>
            )}
          </div>
          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-2 mt-4 justify-center">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000${img.image_url}`}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`h-16 w-16 object-cover rounded cursor-pointer border-2 ${currentImage === idx ? 'border-primary-500' : 'border-transparent'}`}
                  onClick={() => setCurrentImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          {/* Title and Status */}
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-300">{status}</span>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-500">Category: {category}</span>
            <span className="text-sm text-gray-500">Type: {type}</span>
            <span className="text-sm text-gray-500">Size: {size}</span>
            <span className="text-sm text-gray-500">Condition: {condition}</span>
          </div>
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(tag => (
                <span key={tag.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">{tag.name}</span>
              ))}
            </div>
          )}
          {/* Description */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
          {/* Owner Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Owner</h3>
            <div className="flex items-center space-x-3">
              {owner.profile_image_url ? (
                <img src={owner.profile_image_url} alt={owner.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{owner.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Coins className="h-4 w-4 mr-1" />
                  {owner.points_balance || 0} points
                </div>
              </div>
            </div>
          </div>
          {/* Swap/Redeem Actions */}
          {item.status === 'available' && user && item.owner_id !== user.id && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center">
                  <Coins className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    You have <span className="font-semibold text-primary-600">{user.points} points</span>
                  </span>
                </div>
                <WishlistButton itemId={item.id} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSwap('swap')}
                  disabled={swapLoading}
                  className="btn-primary flex items-center justify-center"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {swapLoading ? 'Sending...' : 'Request Swap'}
                </button>
                
                <button
                  onClick={() => handleSwap('redeem')}
                  disabled={swapLoading || user.points < 1}
                  className="btn-secondary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Coins className="h-4 w-4 mr-2" />
                  {swapLoading ? 'Sending...' : 'Redeem (1 pt)'}
                </button>
              </div>
            </div>
          )}

          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Please <button 
                  onClick={() => navigate('/login')}
                  className="font-medium underline hover:no-underline"
                >
                  login
                </button> to request this item.
              </p>
            </div>
          )}

          {item.status !== 'available' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                This item is no longer available for requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPage; 
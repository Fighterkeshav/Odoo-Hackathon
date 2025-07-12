import React, { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WishlistButton = ({ itemId, className = '' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistItem, setWishlistItem] = useState(null);

  useEffect(() => {
    checkWishlistStatus();
  }, [itemId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await axios.get(`/api/wishlist/check/${itemId}`);
      setIsInWishlist(response.data.inWishlist);
      setWishlistItem(response.data.wishlistItem);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!itemId) return;
    
    setLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`/api/wishlist/${wishlistItem.id}`);
        setIsInWishlist(false);
        setWishlistItem(null);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const response = await axios.post('/api/wishlist', {
          item_id: itemId
        });
        setIsInWishlist(true);
        setWishlistItem(response.data.wishlistItem);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update wishlist';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
        isInWishlist 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
      )}
    </button>
  );
};

export default WishlistButton; 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Heart, 
  Trash2, 
  Edit3, 
  User, 
  Calendar,
  Loader2
} from 'lucide-react';

const WishlistPage = () => {
  const { user: authUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ notes: '', priority: 'medium' });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      await axios.delete(`/api/wishlist/${wishlistItemId}`);
      setWishlist(wishlist.filter(item => item.id !== wishlistItemId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditForm({
      notes: item.notes || '',
      priority: item.priority || 'medium'
    });
  };

  const handleSaveEdit = async (wishlistItemId) => {
    try {
      await axios.put(`/api/wishlist/${wishlistItemId}`, editForm);
      setWishlist(wishlist.map(item => 
        item.id === wishlistItemId 
          ? { ...item, ...editForm }
          : item
      ));
      setEditingItem(null);
      toast.success('Wishlist item updated');
    } catch (error) {
      toast.error('Failed to update wishlist item');
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditForm({ notes: '', priority: 'medium' });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Heart className="h-8 w-8 text-red-500 mr-3" />
          My Wishlist
        </h1>
        <p className="text-gray-600 mt-2">
          Items you've saved for later
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Start browsing items and add them to your wishlist to see them here.
          </p>
          <Link
            to="/items"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Browse Items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((wishlistItem) => (
            <div key={wishlistItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                {wishlistItem.item.image_url ? (
                  <img
                    src={wishlistItem.item.image_url}
                    alt={wishlistItem.item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(wishlistItem.priority)}`}>
                    {wishlistItem.priority}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {wishlistItem.item.title}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(wishlistItem)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit notes"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(wishlistItem.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <User className="h-4 w-4 mr-1" />
                  <span>{wishlistItem.item.owner.name}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Added {formatDate(wishlistItem.created_at)}</span>
                </div>

                {editingItem === wishlistItem.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      placeholder="Add notes about this item..."
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      rows="2"
                    />
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveEdit(wishlistItem.id)}
                        className="flex-1 px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {wishlistItem.notes && (
                      <p className="text-sm text-gray-600 mb-3 italic">
                        "{wishlistItem.notes}"
                      </p>
                    )}
                    <Link
                      to={`/items/${wishlistItem.item.id}`}
                      className="block w-full text-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                    >
                      View Item
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage; 
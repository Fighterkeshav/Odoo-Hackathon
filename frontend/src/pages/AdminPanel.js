import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Shield, 
  Users, 
  Gift, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Coins,
  Clock,
  User
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [itemFilters, setItemFilters] = useState({
    status: '',
    category: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab, itemFilters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'overview') {
        const statsResponse = await axios.get('/api/admin/stats');
        setStats(statsResponse.data);
      } else if (activeTab === 'items') {
        const params = new URLSearchParams();
        if (itemFilters.status) params.append('status', itemFilters.status);
        if (itemFilters.category) params.append('category', itemFilters.category);
        
        const itemsResponse = await axios.get(`/api/admin/items?${params}`);
        setItems(itemsResponse.data);
      } else if (activeTab === 'users') {
        const usersResponse = await axios.get('/api/admin/users');
        setUsers(usersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleItemApproval = async (itemId, status) => {
    try {
      await axios.put(`/api/admin/items/${itemId}/approve`, { status });
      toast.success(`Item ${status === 'available' ? 'approved' : 'rejected'} successfully`);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update item';
      toast.error(message);
    }
  };

  const handleUserAdminToggle = async (userId, isAdmin) => {
    try {
      await axios.put(`/api/admin/users/${userId}/admin`, { is_admin: isAdmin });
      toast.success(`User admin status updated successfully`);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user';
      toast.error(message);
    }
  };

  // Helper functions for normalized fields
  const getItemMainImage = (item) => (item.images && item.images.length > 0 ? item.images[0].image_url : null);
  const getItemTags = (item) => item.tags || [];
  const getCategory = (item) => item.category ? item.category.name : '';
  const getSize = (item) => item.size ? item.size.label : '';
  const getCondition = (item) => item.condition ? item.condition.label : '';
  const getType = (item) => item.type || '';
  const getStatus = (item) => item.status || '';

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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      available: 'bg-green-100 text-green-800',
      swapped: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shield className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">Manage the ReWear community</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'items', label: 'Items', icon: Gift },
            { id: 'users', label: 'Users', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Gift className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalItems}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.pendingItems}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.stats.totalSwaps}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Items</h3>
                <div className="space-y-3">
                  {stats.recentActivity.items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">by {item.owner.name}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Swaps</h3>
                <div className="space-y-3">
                  {stats.recentActivity.swaps.slice(0, 5).map((swap) => (
                    <div key={swap.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{swap.item.title}</p>
                        <p className="text-sm text-gray-600">
                          {swap.fromUser.username} → {swap.toUser.username}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(swap.status)}`}>
                        {swap.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            {/* Filters */}
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={itemFilters.status}
                    onChange={(e) => setItemFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="available">Available</option>
                    <option value="swapped">Swapped</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={itemFilters.category}
                    onChange={(e) => setItemFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">All Categories</option>
                    <option value="tops">Tops</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="dresses">Dresses</option>
                    <option value="outerwear">Outerwear</option>
                    <option value="shoes">Shoes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden">
                        {getItemMainImage(item) ? (
                          <img
                            src={`http://localhost:5000${getItemMainImage(item)}`}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-2xl">
                            👕
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{getSize(item)}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCondition(item)}`}>
                            {getCondition(item)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatus(item)}`}>
                            {getStatus(item)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <User className="h-4 w-4 mr-1" />
                          <span>{item.owner.username}</span>
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
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                      {getStatus(item) === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleItemApproval(item.id, 'available')}
                            className="btn-primary text-sm flex items-center"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleItemApproval(item.id, 'rejected')}
                            className="btn-danger text-sm flex items-center"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {user.profile_image_url ? (
                          <img
                            src={`http://localhost:5000${user.profile_image_url}`}
                            alt={user.username}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 text-primary-600" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.username}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-600">{user.bio}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          {user.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{user.location}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-1" />
                            <span>{user.points} points</span>
                          </div>
                          <div className="flex items-center">
                            <Gift className="h-4 w-4 mr-1" />
                            <span>{user.items.length} items</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Joined</p>
                        <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {user.is_admin && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Admin
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleUserAdminToggle(user.id, !user.is_admin)}
                          className={`px-3 py-1 text-sm rounded ${
                            user.is_admin 
                              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 
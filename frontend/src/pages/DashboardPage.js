import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Gift, 
  Coins, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  MapPin,
  Calendar,
  Eye
} from 'lucide-react';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/dashboard');
      setDashboardData(response.data);
      updateUser(response.data.user);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapResponse = async (swapId, status) => {
    try {
      await axios.put(`/api/swaps/${swapId}/respond`, { status });
      toast.success(`Swap request ${status} successfully`);
      fetchDashboardData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to respond to swap';
      toast.error(message);
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Coins className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Points</p>
              <p className="text-2xl font-bold text-gray-900">{user.points}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Gift className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Items</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.items?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Swaps</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.receivedSwaps?.filter(s => s.status === 'pending').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.sentSwaps?.filter(s => s.status === 'accepted').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'items', label: 'My Items', count: dashboardData?.items?.length || 0 },
            { id: 'received', label: 'Received Requests', count: dashboardData?.receivedSwaps?.length || 0 },
            { id: 'sent', label: 'Sent Requests', count: dashboardData?.sentSwaps?.length || 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* My Items Tab */}
        {activeTab === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
              <Link to="/add-item" className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Link>
            </div>

            {dashboardData?.items?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👕</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                <p className="text-gray-600 mb-4">Start sharing your clothes with the community</p>
                <Link to="/add-item" className="btn-primary">
                  Add Your First Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData?.items?.map((item) => (
                  <div key={item.id} className="card">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                      {item.image_url ? (
                        <img
                          src={`http://localhost:5000${item.image_url}`}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-4xl">
                          👕
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{item.size}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(item.condition)}`}>
                        {item.condition}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/items/${item.id}`}
                        className="flex-1 btn-secondary text-center text-sm"
                      >
                        <Eye className="h-4 w-4 mr-1 inline" />
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Received Requests Tab */}
        {activeTab === 'received' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Received Requests</h2>
            
            {dashboardData?.receivedSwaps?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📨</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                <p className="text-gray-600">When someone requests your items, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.receivedSwaps?.map((swap) => (
                  <div key={swap.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden">
                          {swap.item.image_url ? (
                            <img
                              src={`http://localhost:5000${swap.item.image_url}`}
                              alt={swap.item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-2xl">
                              👕
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{swap.item.title}</h3>
                          <p className="text-sm text-gray-600">
                            Requested by {swap.fromUser.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(swap.status)}`}>
                              {swap.status}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(swap.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {swap.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSwapResponse(swap.id, 'accepted')}
                            className="btn-primary text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleSwapResponse(swap.id, 'rejected')}
                            className="btn-danger text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sent Requests Tab */}
        {activeTab === 'sent' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Sent Requests</h2>
            
            {dashboardData?.sentSwaps?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sent requests</h3>
                <p className="text-gray-600">When you request items, they'll appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.sentSwaps?.map((swap) => (
                  <div key={swap.id} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden">
                          {swap.item.image_url ? (
                            <img
                              src={`http://localhost:5000${swap.item.image_url}`}
                              alt={swap.item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-2xl">
                              👕
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900">{swap.item.title}</h3>
                          <p className="text-sm text-gray-600">
                            From {swap.toUser.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(swap.status)}`}>
                              {swap.status}
                            </span>
                            <span className="text-xs text-gray-500">{formatDate(swap.created_at)}</span>
                            <span className="text-xs text-gray-500 capitalize">{swap.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/items/${swap.item.id}`}
                        className="btn-secondary text-sm"
                      >
                        View Item
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 
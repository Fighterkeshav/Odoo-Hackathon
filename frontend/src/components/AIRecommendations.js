import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, MapPin, Star, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/ai/recommendations');
      if (response.data.success) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      toast.error('Failed to load AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Loading AI recommendations...</span>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Top Recommendations */}
      {recommendations.recommendations && recommendations.recommendations.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
          </div>
          
          <div className="space-y-4">
            {recommendations.recommendations.slice(0, 5).map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">Match Score: {rec.matchScore}%</span>
                    </div>
                    <p className="text-gray-600 text-sm">{rec.reason}</p>
                  </div>
                  <button className="ml-4 text-purple-600 hover:text-purple-700">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Suggestions */}
      {recommendations.styleSuggestions && recommendations.styleSuggestions.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Style Suggestions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.styleSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Recommendations */}
      {recommendations.seasonalRecommendations && recommendations.seasonalRecommendations.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Seasonal Recommendations</h3>
          </div>
          
          <div className="space-y-2">
            {recommendations.seasonalRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchRecommendations}
          className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Refresh Recommendations</span>
        </button>
      </div>
    </div>
  );
};

export default AIRecommendations; 
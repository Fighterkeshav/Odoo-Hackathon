import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Lightbulb, Calendar, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/ai/insights');
      if (response.data.success) {
        setInsights(response.data.insights);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-2 text-gray-600">Loading AI insights...</span>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Style Analysis */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Style Analysis</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{insights.styleAnalysis}</p>
      </div>

      {/* Activity Insights */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Activity Insights</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{insights.activityInsights}</p>
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {insights.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Seasonal Suggestions */}
      {insights.seasonalSuggestions && insights.seasonalSuggestions.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Seasonal Suggestions</h3>
          </div>
          <ul className="space-y-2">
            {insights.seasonalSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchInsights}
          className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Refresh Insights</span>
        </button>
      </div>
    </div>
  );
};

export default AIInsights; 
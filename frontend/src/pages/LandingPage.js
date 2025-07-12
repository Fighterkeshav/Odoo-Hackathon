import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Gift, 
  Users, 
  Heart, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Give & Receive',
      description: 'Share your unused clothes and find new treasures from the community.'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Sustainable Fashion',
      description: 'Reduce waste and promote circular fashion through community exchange.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'Connect with like-minded people who care about sustainable fashion.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Point System',
      description: 'Earn points by giving and redeem them for items you want.'
    }
  ];

  const stats = [
    { number: '—', label: 'Items Shared' },
    { number: '—', label: 'Happy Users' },
    { number: '—', label: 'Cities' },
    { number: '—', label: 'Sustainable' }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
                <Gift className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Sustainable Fashion
              <span className="text-primary-600"> Community</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join ReWear and be part of a community that values sustainable fashion. 
              Give your unused clothes a new life and discover unique pieces from others.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/items"
                    className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
                  >
                    Browse Items
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/add-item"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Add Your Items
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3 flex items-center justify-center"
                  >
                    Join ReWear
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/items"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Browse Items
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're building a sustainable fashion community where everyone benefits
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to join the sustainable fashion movement
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Sign Up & Add Items
              </h3>
              <p className="text-gray-600">
                Create your account and upload photos of clothes you want to share
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Earn Points
              </h3>
              <p className="text-gray-600">
                Get 1 point for each item you give away to the community
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Redeem & Swap
              </h3>
              <p className="text-gray-600">
                Use your points to redeem items or arrange direct swaps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start sharing your clothes and discover sustainable fashion today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/add-item"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Add Your First Item
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 
const path = require('path');

module.exports = function override(config, env) {
  // Fix for allowedHosts issue
  if (config.devServer) {
    config.devServer.allowedHosts = 'all';
  }
  
  return config;
}; 
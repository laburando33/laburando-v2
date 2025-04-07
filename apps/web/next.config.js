const { withExpo } = require('@expo/next-adapter')

module.exports = withExpo({
  transpilePackages: ['expo', 'react-native'],
  
  webpack(config) {
    config.resolve.alias['react-native$'] = 'react-native-web'
    return config
  }
})

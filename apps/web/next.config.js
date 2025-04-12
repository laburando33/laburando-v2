const { withExpo } = require('@expo/next-adapter');

module.exports = withExpo({
  transpilePackages: ['expo', 'react-native'],

  webpack(config) {
    config.resolve.alias['react-native$'] = 'react-native-web';
    return config;
  },

  reactStrictMode: true,

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
});

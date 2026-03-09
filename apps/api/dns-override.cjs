// Preload this with: node -r ./dns-override.cjs
// Overrides DNS to use 8.8.8.8 for Neon endpoints
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

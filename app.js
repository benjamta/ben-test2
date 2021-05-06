const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://app.rainbird.ai/";
/*
http://localhost:3000/evidence?id=WA:RF:2f20be82f0b3dd14db0b26818a16a9fcb5b2d3e5e2440c142f913f7ab25c844f&api=https://api.rainbird.ai&engine=Core&sid=6eebe195-d72d-44e5-8ee4-8d84de696f2d&key=41aec83e-4cc2-9ad5-19dc-261997a461c0


http://localhost:3000//evidence?id=WA:RF:880ebd4fe55259c6d0ebc27f2d081642f899c7ccbc301342718bdbb2c89055d9&api=https://api.rainbird.ai&engine=Core&sid=3360b098-5854-4f9c-9cdf-d7bbd2c875fe&key=991215ee-6f99-4b29-9f87-901e76b60cde
*/

// Logging
app.use(morgan('dev'));

 // Proxy endpoint
app.use('/', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: function (path, req) { 
        return path.replace('&key=', '');
    },

    onProxyReq: function (proxyReq, req, res) {
        if(req.query.key) {
            proxyReq.setHeader('x-evidence-key', req.query.key);
        }
      },
 }));

 // Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
 });
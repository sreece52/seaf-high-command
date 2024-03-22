const path = require('node:path');
const { configureClient } = require('./src/client-util');
require('dotenv').config({path: path.join(__dirname, '.env')})

const { configureLogger } = require('./src/app-logger');

configureLogger()

// Create a new client instance
configureClient();

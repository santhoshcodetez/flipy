const express = require("express");
const app = express();
require('dotenv').config();
app.use(express.json());

// Import main router
const router = require('./src/routes/index');
app.use('/api', router);

module.exports = app;

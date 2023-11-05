const express = require('express');
const app = express();

// Load the .env file and set environment variables
require("dotenv").config();

// Create an API endpoint to get the OPENAI_API_KEY
app.get('/getOpenApiKey', (req, res) => {
  res.json({ apiKey: process.env.OPENAI_API_KEY });
});

// Start your server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

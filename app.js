// Load Required Modules
const express = require('express');
const bodyParser = require('body-parser');

// Import Routes
const date = require('./routes/date');

// Define App
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define Route URIs
app.use('/api/v1.0/date', date);

// Define port variable. Defaults to 5000 if not set
const port = process.env.PORT || 3030;

// Start Express
app.listen(port, () => {
  console.log(`Express API Server is running on port: ${port}`);
});

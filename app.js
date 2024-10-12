const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const dealRoutes = require('./routes/dealRoutes');
const stageRoutes = require('./routes/stageRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', dealRoutes, stageRoutes, pipelineRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
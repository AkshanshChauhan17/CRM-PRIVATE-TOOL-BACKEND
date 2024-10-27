const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const dealRoutes = require('./routes/dealRoutes');
const stageRoutes = require('./routes/stageRoutes');
const pipelineRoutes = require('./routes/pipelineRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const schedulesRoutes = require('./routes/scheduleRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', dealRoutes, stageRoutes, pipelineRoutes, userRoutes, authRoutes, commentRoutes);
app.use('/api/deals/upload', uploadRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/deals', conversationRoutes);
app.use('/api/img/conv', imageRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
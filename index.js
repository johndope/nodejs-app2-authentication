const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import routes here
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// Connect to Mongo DB
mongoose.connect(process.env.DB_CONNECTION, 
    {useNewUrlParser: true,useUnifiedTopology: true},
    () => {
        console.log('DB Connected...');
    });

// Middleware
app.use(express.json()); // allows to parse json request data

// Route Middleware here
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(process.env.PORT, () => {
    console.log('App is running...');
});
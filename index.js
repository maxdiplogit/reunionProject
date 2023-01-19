if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


// Packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Routers
const mainRouter = require('./routers/mainRouter');


// Create the application
const app = express();


// Middlewares for 'app'
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


// Routes
// ------------------------------------------------------------------------------------------------------------------------------------------------------

app.get('/', (req, res, next) => {
    res.send('Reunion Project');
});

app.use('/api', mainRouter);



if (process.env.NODE_ENV !== 'test') {
    // Connecting to the remote MongoDB Atlas Database
    const dbURL = process.env.MONGODB_CONNECTION_STRING;
    mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then((res) => {
            console.log('Mongoose Connection Open!');
            // Start the server at port 8081
            app.listen('8081', async () => {
                console.log('Server started listening at port 8081 ...');
            });
        })
        .catch((err) => {
            console.log('Oh no! Mongoose Connection Error!');
            console.log(err);
        });
} else {
    mongoose.connect('mongodb://127.0.0.1:27017/reunion', { useNewUrlParser: true, useUnifiedTopology: true })
        .then((res) => {
            console.log('Local Mongoose connection open!');
            // Start the server at port 8081
            app.listen('8081', async () => {
                console.log('Server started listening at port 8081 ...');
            });
        })
        .catch((err) => {
            console.log('Oh no! Mongoose Connection Error!');
            console.log(err);
        });
}


module.exports = app;
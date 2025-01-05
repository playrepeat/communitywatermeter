const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();
const path = require('path');
const app = express();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
};

console.log('Database User:', dbConfig.user);

app.set('view engine', 'ejs'); // Use EJS for rendering views
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 30 * 1000 }  // Set cookie expiration time 
}));

app.use((req, res, next) => {
    if (req.session.userName) {
        res.locals.userName = req.session.userName; // Make userName available in all views
    } else {
        res.locals.userName = null; // Ensure it's null if the user isn't logged in
    }
    next();
});



// Use the userRoutes for handling /user routes
app.use('/user', userRoutes);



// Route to render index.ejs (Homepage)

app.get('/', (req, res) => {
    res.render('index', { userName: req.session.userName || null });
});



app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

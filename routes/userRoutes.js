// userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();



// Registration route
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, apartment, password } = req.body;

    if (!firstName || !lastName || !email || !apartment || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into watermeterusers table
        const userResult = await pool.query(
            `INSERT INTO watermeterusers (first_name, last_name, email, time_added, apartment)
            VALUES ($1, $2, $3, NOW(), $4) RETURNING id`,
            [firstName, lastName, email, apartment]
        );
        const userId = userResult.rows[0].id;

        // Insert password into watermeterpwd table
        await pool.query(
            `INSERT INTO watermeterpwd (user_id, hashed_password) VALUES ($1, $2)`,
            [userId, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    console.log(`[LOGIN ATTEMPT] Email: ${email},  Time: ${new Date().toISOString()}`);

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    try {
        // Check if user exists
        const userResult = await pool.query(
            'SELECT id, first_name FROM watermeterusers WHERE email = $1',
            [email]
        );
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        // Fetch the hashed password
        const pwdResult = await pool.query(
            'SELECT hashed_password FROM watermeterpwd WHERE user_id = $1',
            [user.id]
        );
        const hashedPassword = pwdResult.rows[0]?.hashed_password;

        if (!hashedPassword) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password!' });
        }

        // Set session data
        req.session.userId = user.id;
        req.session.userName = user.first_name;

        // Send both message and redirect URL
        res.status(200).json({
            message: 'Login successful!',
            redirectUrl: '/user/profile',
        });

        /*// Set session data
        req.session.userId = user.id;
        req.session.userName = user.first_name;

        res.status(200).json({ message: 'Login successful!' });*/
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});


// Profile page route
router.get('/profile', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/'); // Redirect to home if not logged in
    }

    try {
        const userId = req.session.userId;

        // Fetch user details
        const userResult = await pool.query(
            'SELECT first_name, last_name, email, apartment, time_added FROM watermeterusers WHERE id = $1',
            [userId]
        );
        const user = userResult.rows[0];

        if (!user) {
            return res.redirect('/'); // Redirect if user not found
        }

        // Fetch water meter records
        const recordsResult = await pool.query(
            'SELECT id, water_usage, notes, reading_date FROM watermeterrecords WHERE user_id = $1 ORDER BY reading_date DESC',
            [userId]
        );
        const records = recordsResult.rows; // Fetch all records, not just the first one

        const userData = {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            apartmentNumber: user.apartment,
            registrationDate: user.time_added,
        };
        console.log('UserData:', userData);
        console.log('Records:', records);

        // Render profile with user details and records
        res.render('profile', { userName: user.first_name, user: userData, records });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).send('Internal server error');
    }
});



//water record route
router.post('/record', async (req, res) => {
    const { waterUsage, notes } = req.body;

    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    // Check if the current date is within the submission window (1st to 10th of the month)
    const now = new Date();
    const dayOfMonth = now.getDate();

    if (dayOfMonth < 1 || dayOfMonth > 10) {
        return res.status(403).json({
            message: 'You can only submit water usage data between the 1st and 10th of each month.',
        });
    }

    // Validate water usage input
    if (!waterUsage || isNaN(waterUsage) || waterUsage <= 0) {
        return res.status(400).json({ message: 'Invalid water usage value!' });
    }

    try {
        // Insert the water usage data into the database
        await pool.query(
            `INSERT INTO watermeterrecords (user_id, water_usage, notes) VALUES ($1, $2, $3)`,
            [req.session.userId, waterUsage, notes || null]
        );

        res.status(201).json({ message: 'Water meter usage recorded successfully!' });
    } catch (error) {
        console.error('Error recording water usage:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});


// previous record routes
router.get('/records', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    try {
        const result = await pool.query(
            `SELECT recorded_date, water_usage, notes FROM watermeterrecords WHERE user_id = $1 ORDER BY recorded_date DESC`,
            [req.session.userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching water meter records:', error);
        res.status(500).json({ message: 'Internal server error!' });
    }
});



// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/'); // Redirect to homepage
    });
});




module.exports = router;

const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User } = require('../db');
const JWT_SECRET = require('../config');

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
});

router.post('/signup', async (req, res) => {
    // Validate the input data
    const { success, error } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect input",
            details: error.errors
        });
    }

    const { username, password, firstName, lastName } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "Username already taken"
            });
        }

        // Create a new user if user is unique
        const dbUser = await User.create({ username, password, firstName, lastName });

        // Create a JWT token
        // expiresIn how long user will log in
        // store JWT_SECRET in config file 
        const token = jwt.sign({ userId: dbUser._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send response
        res.status(201).json({
            message: "User created successfully",
            token: token
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        });
    }
});

module.exports = router;

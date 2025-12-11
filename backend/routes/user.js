const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require('../db');
const JWT_SECRET = process.env.JWT_SECRET;
const { authMiddleware } = require("../middleware");

const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string().optional(),
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

        const { Account } = require('../db');

        // ... inside signup route ...
        // Create a new user if user is unique
        const dbUser = await User.create({ username, password, firstName, lastName });

        /// ----- Create new account ------
        await Account.create({
            userId: dbUser._id,
            balance: 1 + Math.random() * 10000
        })
        /// -----------------------------

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

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
                "$options": "i" // Case-insensitive
            }
        }, {
            lastName: {
                "$regex": filter,
                "$options": "i"
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post('/signin', async (req, res) => {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

module.exports = router;


const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;
    console.log(`Transfer request - Amount: ${amount}, To: ${to}, From: ${req.userId}`);

    if (amount < 1) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Transfer amount must be at least 1"
        });
    }

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account) {
        await session.abortTransaction();
        console.log(`Sender account not found for user: ${req.userId}`);
        return res.status(400).json({
            message: "Sender account not found"
        });
    }

    if (account.balance < amount) {
        await session.abortTransaction();
        console.log(`Insufficient balance. Balance: ${account.balance}, Amount: ${amount}`);
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        console.log(`Invalid destination account. UserId: ${to}`);
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;

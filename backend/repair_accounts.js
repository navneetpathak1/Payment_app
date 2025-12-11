const mongoose = require('mongoose');
const { User, Account } = require('./db');
// Connect to DB (using string from db.js)
mongoose.connect("mongodb+srv://navneetpathak2005_db_user:STyEbAg6hfmmUptT@cluster0.veffsbe.mongodb.net/paytm", {
    serverSelectionTimeoutMS: 5000,
    family: 4,
    tls: true,
    tlsAllowInvalidCertificates: true
})
    .then(() => console.log("Connected to MongoDB for repair"))
    .catch(err => console.error("DB Connection Error:", err));

async function repairAccounts() {
    try {
        const users = await User.find({});
        console.log(`Found ${users.length} users. Checking accounts...`);

        let fixedCount = 0;
        for (const user of users) {
            const account = await Account.findOne({ userId: user._id });
            if (!account) {
                console.log(`User ${user.username} (${user._id}) missing account. Creating...`);
                await Account.create({
                    userId: user._id,
                    balance: 1 + Math.random() * 10000
                });
                fixedCount++;
            }
        }
        console.log(`Repair complete. Fixed ${fixedCount} users.`);
        process.exit(0);

    } catch (err) {
        console.error("Repair failed:", err);
        process.exit(1);
    }
}

// Give some time for connection
setTimeout(repairAccounts, 2000);

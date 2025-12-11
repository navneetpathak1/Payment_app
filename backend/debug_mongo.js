
const mongoose = require('mongoose');

async function debugMongo() {
    const uri = "mongodb+srv://navneetpathak2005_db_user:STyEbAg6hfmmUptT@cluster0.veffsbe.mongodb.net/paytm";
    console.log("Attempting to connect to:", uri.replace(/:([^:@]+)@/, ':****@'));

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            family: 4 // Force IPv4
        });
        console.log("Connection SUCCESS!");
        await mongoose.connection.close();
    } catch (err) {
        console.error("Connection FAILED:");
        console.error(err);
        if (err.reason) console.error("Reason:", err.reason);
    }
}

debugMongo();

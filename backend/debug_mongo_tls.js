
const mongoose = require('mongoose');

async function debugMongo() {
    const uri = "mongodb+srv://navneetpathak2005_db_user:STyEbAg6hfmmUptT@cluster0.veffsbe.mongodb.net/paytm";
    console.log("Testing connection with TLS 1.2...");

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            family: 4,
            tls: true,
            tlsAllowInvalidCertificates: true, // For debugging only
        });
        console.log("Connection SUCCESS with options!");
        await mongoose.connection.close();
    } catch (err) {
        console.error("Connection FAILED:");
        console.error(err.message);
    }
}

debugMongo();

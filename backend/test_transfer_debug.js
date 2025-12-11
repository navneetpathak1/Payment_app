const fs = require('fs');

const logFile = 'test_output.log';
// Clear log file
fs.writeFileSync(logFile, '');

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg); // Keep console for progress
}

const BASE_URL = 'http://localhost:3000/api/v1';

async function testTransfer() {
    try {
        // Helper for fetch
        const post = async (url, body, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            const data = await res.json();
            return { status: res.status, data };
        };

        const get = async (url) => {
            const res = await fetch(url);
            const data = await res.json();
            return { status: res.status, data };
        };

        // 1. Signup User A
        const userA = {
            username: `userA_${Date.now()}@test.com`,
            password: 'password123',
            firstName: 'User',
            lastName: 'A'
        };
        log(`Signing up User A: ${userA.username}`);
        const resA = await post(`${BASE_URL}/user/signup`, userA);
        const tokenA = resA.data.token;
        log(`User A signed up. Token: ${tokenA ? 'Received' : 'Missing'}`);

        // 2. Signup User B
        const userB = {
            username: `userB_${Date.now()}@test.com`,
            password: 'password123',
            firstName: `UserB_${Date.now()}`,
            lastName: 'B'
        };
        log(`Signing up User B: ${userB.username}`);
        const resB = await post(`${BASE_URL}/user/signup`, userB);

        // Find User B ID
        log(`Searching for User B ID with filter: ${userB.firstName}`);
        const bulkRes = await get(`${BASE_URL}/user/bulk?filter=${userB.firstName}`);
        log(`Bulk response user count: ${bulkRes.data.user ? bulkRes.data.user.length : 'No user array'}`);
        if (bulkRes.data.user) {
            const names = bulkRes.data.user.map(u => u.username);
            log(`Bulk Usernames: ${JSON.stringify(names)}`);
        }

        const foundUserB = bulkRes.data.user ? bulkRes.data.user.find(u => u.username === userB.username.toLowerCase()) : null; // Ensure lowercase match

        if (!foundUserB) {
            log('Could not find User B ID');
            return;
        }
        const userBId = foundUserB._id;
        log(`User B ID: ${userBId}`);

        // 3. Transfer from A to B
        log(`Initiating transfer from A to B (${userBId})...`);
        const transferRes = await post(`${BASE_URL}/account/transfer`, {
            to: userBId,
            amount: 10
        }, tokenA);

        log(`Transfer Result Status: ${transferRes.status}`);
        log(`Transfer Result Data: ${JSON.stringify(transferRes.data)}`);

    } catch (err) {
        log(`Test script error: ${err.message}`);
    }
}

testTransfer();

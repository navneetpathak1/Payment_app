const fs = require('fs');

const logFile = 'validation_output.log';
// Clear log file
fs.writeFileSync(logFile, '');

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

const BASE_URL = 'http://localhost:3000/api/v1';

async function testValidation() {
    try {
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

        // 1. Signup User with NO Last Name
        const userNoLast = {
            username: `userNoLast_${Date.now()}@test.com`,
            password: 'password123',
            firstName: 'NoLast'
            // lastName omitted
        };
        log(`Test 1: Signup User without Last Name`);
        const res1 = await post(`${BASE_URL}/user/signup`, userNoLast);
        log(`Result: ${res1.status} - ${JSON.stringify(res1.data)}`);
        if (res1.status === 200 || res1.status === 201) {
            const token1 = res1.data.token;

            // Setup a receiver
            const userReceiver = {
                username: `receiver_${Date.now()}@test.com`,
                password: 'password123',
                firstName: 'Receiver',
                lastName: 'User'
            };
            const resReceiver = await post(`${BASE_URL}/user/signup`, userReceiver);

            // Get Receiver ID via bulk
            const bulkRes = await get(`${BASE_URL}/user/bulk?filter=${userReceiver.firstName}`);
            const receiverId = bulkRes.data.user.find(u => u.username === userReceiver.username)._id;
            log(`Receiver ID: ${receiverId}`);

            // 2. Transfer 0.5 (Should Fail)
            log(`Test 2: Transfer 0.5 (Expect 400)`);
            const res2 = await post(`${BASE_URL}/account/transfer`, {
                to: receiverId,
                amount: 0.5
            }, token1);
            log(`Result: ${res2.status} - ${JSON.stringify(res2.data)}`);

            // 3. Transfer -10 (Should Fail)
            log(`Test 3: Transfer -10 (Expect 400)`);
            const res3 = await post(`${BASE_URL}/account/transfer`, {
                to: receiverId,
                amount: -10
            }, token1);
            log(`Result: ${res3.status} - ${JSON.stringify(res3.data)}`);

            // 4. Transfer 1 (Should Success)
            log(`Test 4: Transfer 1 (Expect 200)`);
            const res4 = await post(`${BASE_URL}/account/transfer`, {
                to: receiverId,
                amount: 1
            }, token1);
            log(`Result: ${res4.status} - ${JSON.stringify(res4.data)}`);

        } else {
            log('Skipping transfer tests due to signup failure');
        }

    } catch (err) {
        log(`Test script error: ${err.message}`);
    }
}

testValidation();

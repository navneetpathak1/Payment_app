
async function testTransfer() {
    try {
        const email1 = "user1_" + Date.now() + "@example.com";
        const email2 = "user2_" + Date.now() + "@example.com";

        // 1. Create two users
        console.log("Creating User 1...");
        const res1 = await fetch('http://localhost:3003/api/v1/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email1, password: "password", firstName: "User", lastName: "One" })
        });
        const data1 = await res1.json();
        const token1 = data1.token;

        console.log("Creating User 2...");
        const res2 = await fetch('http://localhost:3003/api/v1/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email2, password: "password", firstName: "User", lastName: "Two" })
        });
        const data2 = await res2.json();

        // Let's find User 2 via bulk search
        const searchRes = await fetch('http://localhost:3003/api/v1/user/bulk?filter=' + email2);
        const searchData = await searchRes.json();
        const user2Id = searchData.user[0]._id;
        console.log("User 2 ID:", user2Id);

        // 2. Check Balance of User 1
        console.log("Checking User 1 Balance...");
        const balRes1 = await fetch('http://localhost:3003/api/v1/account/balance', {
            headers: { Authorization: "Bearer " + token1 }
        });
        const balData1 = await balRes1.json();
        const initialBal1 = balData1.balance;
        console.log("User 1 Initial Balance:", initialBal1);

        if (initialBal1 < 10) {
            console.log("Skipping transfer test, balance too low.");
            return;
        }

        // 3. Transfer 10 from User 1 to User 2
        console.log("Transferring 10 from User 1 to User 2...");
        const transferRes = await fetch('http://localhost:3003/api/v1/account/transfer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + token1
            },
            body: JSON.stringify({ to: user2Id, amount: 10 })
        });
        console.log("Transfer Status:", transferRes.status);
        console.log("Transfer Body:", await transferRes.text());

        // 4. Verify User 1 Balance Decreased
        const balRes1Final = await fetch('http://localhost:3003/api/v1/account/balance', {
            headers: { Authorization: "Bearer " + token1 }
        });
        const balData1Final = await balRes1Final.json();
        console.log("User 1 Final Balance:", balData1Final.balance);

        if (Math.abs(initialBal1 - balData1Final.balance - 10) < 0.01) {
            console.log("TEST SUCCESS: Balance updated correctly.");
        } else {
            console.log("TEST FAILURE: Balance mismatch.");
        }

    } catch (err) {
        console.error("Test Failed:", err);
    }
}

testTransfer();

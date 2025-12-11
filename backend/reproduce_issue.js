
async function reproduce() {
    try {
        const response = await fetch('http://localhost:3001/api/v1/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "debug_" + Date.now() + "@example.com",
                password: "password123",
                firstName: "Debug",
                lastName: "User"
            })
        });

        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Body:", text);
    } catch (err) {
        console.error("Request failed:", err);
    }
}

reproduce();


async function probe() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: "probe_" + Date.now() + "@example.com",
                password: "password123",
                firstName: "Probe",
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
probe();


async function testBulk() {
    try {
        console.log("Searching for 'test'...");
        const response = await fetch('http://localhost:3002/api/v1/user/bulk?filter=test');
        console.log("Status:", response.status);
        if (response.status === 200) {
            const data = await response.json();
            console.log("Users found:", data.user.length);
        } else {
            const text = await response.text();
            console.log("Body:", text);
        }
    } catch (err) {
        console.error("Test failed:", err);
    }
}
testBulk();

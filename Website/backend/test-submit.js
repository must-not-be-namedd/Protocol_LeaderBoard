const http = require('http');

const payload = JSON.stringify({
    username: "testuser_" + Date.now(),
    email: "test_" + Date.now() + "@example.com",
    answers: [
        { questionId: 1, selected: 'A' },
        { questionId: 2, selected: 'B' }
    ]
});

const options = {
    hostname: 'localhost',
    port: 3010,
    path: '/api/submit',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Response:', data);
        process.exit(0);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
});

req.write(payload);
req.end();

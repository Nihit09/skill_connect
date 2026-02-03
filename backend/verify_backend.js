const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, baseURL: 'http://localhost:3000/api', withCredentials: true }));

async function runTest() {
    try {
        console.log('--- STARTING VERIFICATION ---');

        // 1. Register User A (Requester)
        console.log('\n1. Register User A...');
        const emailA = `userA_${Date.now()}@test.com`;
        await client.post('/auth/register', {
            firstName: 'Alice',
            lastName: 'User',
            email: emailA,
            password: 'SecurePass123!'
        });
        console.log('User A Registered');

        // 2. Register User B (Provider/Seller)
        console.log('\n2. Register User B...');
        const emailB = `userB_${Date.now()}@test.com`;
        const resB = await client.post('/auth/register', {
            firstName: 'Bob',
            lastName: 'Seller',
            email: emailB,
            password: 'SecurePass123!'
        });
        console.log('User B Registered');

        // Upgrade B to Seller (Simulate by DB update or just use admin role logic if implemented, 
        // but here B is just a user. Wait, code says "Only sellers can create paid skills".
        // Let's create a Free skill first to avoid role issues, or manually update role if needed.
        // My code sets default role to 'user'. 
        // To test paid skills, I'd need to change role.

        // Login as B
        console.log('\n3. Login as User B...');
        await client.post('/auth/login', { email: emailB, password: 'SecurePass123!' });

        // Create Free Skill
        console.log('\n4. User B creates Skill...');
        const skillRes = await client.post('/skills', {
            title: 'NodeJS Tutoring',
            description: 'Learn Nodejs from scratch with me. Comprehensive lessons.',
            category: 'Web Development',
            difficulty: 'Beginner',
            isPaid: false
        });
        const skillId = skillRes.data.data._id;
        console.log(`Skill Created: ${skillId}`);

        // Logout B
        await client.get('/auth/logout');
        console.log('User B Logged out');

        // Login as A
        console.log('\n5. Login as User A...');
        await client.post('/auth/login', { email: emailA, password: 'SecurePass123!' });

        // Request Exchange
        console.log('\n6. User A requests exchange...');
        const exchangeRes = await client.post('/exchanges', {
            skillId: skillId,
            note: 'I want to learn'
        });
        const exchangeId = exchangeRes.data.data._id;
        console.log(`Exchange Requested: ${exchangeId}`);

        // Logout A
        await client.get('/auth/logout');

        // Login as B to Accept
        console.log('\n7. Login as User B to accept...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Ensure unique iat for token
        await client.post('/auth/login', { email: emailB, password: 'SecurePass123!' });

        // Accept Exchange
        console.log('\n8. User B accepts exchange...');
        await client.patch(`/exchanges/${exchangeId}/status`, {
            status: 'accepted'
        });
        console.log('Exchange Accepted');

        // Check Dashboard
        console.log('\n9. Checking B Dashboard...');
        const dash = await client.get('/dashboard/user');
        console.log('Dashboard Stats:', dash.data.data.stats);

        console.log('\n--- VERIFICATION SUCCESSFUL ---');
    } catch (error) {
        console.error('VERIFICATION FAILED:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

runTest();

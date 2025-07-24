// Simple test script to trigger the cron job
const fetch = require('node-fetch');

async function testCron() {
    try {
        console.log('🧪 Testing cron job...');

        const response = await fetch('http://localhost:3000/api/cron', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ak802135',
                'User-Agent': 'Test-Script'
            }
        });

        const result = await response.json();
        console.log('📊 Response:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('✅ Cron job successful!');
            console.log(`📅 Generated: ${result.attackType} for ${result.date}`);
            console.log(`⏱️  Duration: ${result.duration}`);
        } else {
            console.log('❌ Cron job failed:', result.error);
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testCron();
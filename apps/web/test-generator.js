// Manual test of the sophisticated generator
const { AIContentGenerator } = require('./src/lib/generator/ai');
const { NewsAPIService } = require('./src/lib/generator/newsapi');
const { getNextAttack } = require('./src/lib/generator/attackDatabase');

async function testGenerator() {
    try {
        console.log('🧪 Testing sophisticated generator...');

        // Test environment variables
        const newsApiKey = process.env.NEWS_API_KEY;
        const openrouterApiKey = process.env.OPENROUTER_API_KEY;

        if (!newsApiKey || !openrouterApiKey) {
            console.error('❌ Missing API keys (NEWS_API_KEY, OPENROUTER_API_KEY)');
            return;
        }

        console.log('✅ API keys found');

        // Test attack selection
        const selectedAttack = getNextAttack([]);
        console.log('✅ Selected attack:', selectedAttack.name);

        // Test news service
        const newsService = new NewsAPIService(newsApiKey);
        console.log('🔍 Searching for news...');
        const articles = await newsService.fetchNewsForAttack(selectedAttack);
        console.log(`✅ Found ${articles.length} articles`);

        // Test AI generator
        const aiService = new AIContentGenerator(openrouterApiKey);
        console.log('🤖 Generating content...');

        const blueTeamContent = await aiService.generateBlueTeamContent(selectedAttack, articles);
        console.log('✅ Blue team content generated:', blueTeamContent.about.substring(0, 100) + '...');

        const redTeamContent = await aiService.generateRedTeamContent(selectedAttack, articles);
        console.log('✅ Red team content generated:', redTeamContent.objectives.substring(0, 100) + '...');

        console.log('🎉 Generator test successful!');

    } catch (error) {
        console.error('❌ Generator test failed:', error.message);
        console.error(error.stack);
    }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });
testGenerator();
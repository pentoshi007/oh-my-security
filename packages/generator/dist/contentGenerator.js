import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { NewsAPIService } from './newsapi.js';
import { AIContentGenerator } from './ai.js';
import { getCurrentDate } from './utils.js';
import { DailyContentSchema } from './types.js';
import { getDatabaseSize, getNextAttack, shouldDiscoverNewAttacks, addNewAttacks } from './attackDatabase.js';
import { HistoryTracker } from './historyTracker.js';
import { AttackDiscoveryService } from './attackDiscovery.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load environment variables from the generator's .env file for local execution.
// On Vercel, environment variables will be provided directly.
dotenv.config({ path: join(__dirname, '../.env') });
export async function generateDailyContent(spinner) {
    const newsApiKey = process.env.NEWS_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!newsApiKey || !googleApiKey) {
        spinner.fail('Missing API keys');
        console.error(chalk.red('Ensure NEWS_API_KEY and GOOGLE_API_KEY are set in the .env file.'));
        throw new Error('Missing API keys');
    }
    const newsService = new NewsAPIService(newsApiKey);
    const aiService = new AIContentGenerator(googleApiKey);
    const historyTracker = new HistoryTracker();
    // Load history
    spinner.start('Loading generation history...');
    await historyTracker.load();
    let recentAttackIds = historyTracker.getRecentAttackIds();
    spinner.succeed('History loaded');
    // Check if we should discover new attacks
    if (shouldDiscoverNewAttacks(recentAttackIds)) {
        spinner.start('Looking for new attack methodologies...');
        const attackDiscovery = new AttackDiscoveryService(newsApiKey);
        try {
            const discoveries = await attackDiscovery.discoverNewAttacks();
            if (discoveries.length > 0) {
                const newAttacks = discoveries.map(d => attackDiscovery.convertToAttackMethodology(d));
                const addedCount = addNewAttacks(newAttacks);
                if (addedCount > 0) {
                    spinner.succeed(`Discovered and added ${addedCount} new attack methodologies!`);
                    console.log(chalk.green('🔍 New attacks added to database:'));
                    newAttacks.slice(0, addedCount).forEach(attack => {
                        console.log(chalk.green(`  • ${attack.name} (${attack.category})`));
                    });
                }
                else {
                    spinner.succeed('No new attack methodologies found');
                }
            }
            else {
                spinner.succeed('No new attack methodologies discovered');
            }
        }
        catch (error) {
            spinner.warn('Failed to discover new attacks, continuing with existing database');
            console.log(chalk.yellow('Will continue with existing attack methodologies'));
        }
    }
    // Select next attack methodology
    spinner.start('Selecting attack methodology...');
    const currentDate = getCurrentDate();
    let selectedAttack;
    let articles = [];
    let attempts = 0;
    const maxAttempts = 5;
    const skippedAttacks = [];
    while (attempts < maxAttempts) {
        attempts++;
        selectedAttack = getNextAttack(recentAttackIds);
        if (!selectedAttack) {
            throw new Error('No attack methodology available');
        }
        spinner.text = `Selecting attack methodology (attempt ${attempts})...`;
        spinner.succeed(`Selected: ${selectedAttack.name}`);
        console.log(chalk.blue(`📚 Category: ${selectedAttack.category}`));
        console.log(chalk.blue(`🎯 Difficulty: ${selectedAttack.difficulty}`));
        spinner.start(`Searching for news about ${selectedAttack.name}...`);
        articles = await newsService.fetchNewsForAttack(selectedAttack);
        if (articles.length > 0) {
            spinner.succeed(`Found ${articles.length} relevant articles`);
            break;
        }
        spinner.warn(`No recent news found for ${selectedAttack.name} (attempt ${attempts})`);
        skippedAttacks.push(selectedAttack.id);
        recentAttackIds = [...recentAttackIds, selectedAttack.id];
        if (attempts === maxAttempts) {
            console.log(chalk.yellow('Max attempts reached. Falling back to general news for last selected attack...'));
            const generalArticles = await newsService.fetchCybersecurityNews();
            articles = generalArticles.slice(0, 3);
            spinner.succeed(`Found ${articles.length} general articles`);
        }
    }
    if (!selectedAttack) {
        throw new Error('Failed to select an attack methodology');
    }
    // Display the top news article
    if (articles.length > 0) {
        console.log(chalk.gray(`📰 Top article: "${articles[0].title}" - ${articles[0].source.name}`));
    }
    // Generate content
    spinner.start('Generating educational content...');
    const [blueTeamContent, redTeamContent] = await Promise.all([
        aiService.generateBlueTeamContent(selectedAttack, articles),
        aiService.generateRedTeamContent(selectedAttack, articles),
    ]);
    const dailyContent = {
        date: currentDate,
        attackType: selectedAttack.name, // We'll need to update the types
        article: articles.length > 0 ? {
            title: articles[0].title,
            url: articles[0].url,
            source: articles[0].source.name,
            publishedAt: articles[0].publishedAt,
            summary: articles[0].description || articles[0].title,
        } : {
            title: `Educational Content: ${selectedAttack.name}`,
            url: 'https://oh-my-security.com',
            source: 'Oh-My-Security',
            publishedAt: new Date().toISOString(),
            summary: selectedAttack.description,
        },
        content: {
            blueTeam: blueTeamContent,
            redTeam: redTeamContent,
        },
        metadata: {
            generatedAt: new Date().toISOString(),
            version: '1.0.0',
            attackId: selectedAttack.id,
            category: selectedAttack.category,
            newsArticlesUsed: articles.length,
        }, // We'll need to update the types
    };
    const validatedContent = DailyContentSchema.parse(dailyContent);
    // Update history
    await historyTracker.addAttackId(selectedAttack.id);
    spinner.succeed('Content generated successfully!');
    console.log(chalk.green(`📅 ${currentDate} - ${selectedAttack.name}`));
    console.log(chalk.green(`📊 Total attacks covered: ${historyTracker.getGenerationCount()}/${getDatabaseSize()}`));
    return validatedContent;
}
//# sourceMappingURL=contentGenerator.js.map
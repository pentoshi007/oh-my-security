import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import type { Ora } from 'ora';
import chalk from 'chalk';
import dotenv from 'dotenv';

import { NewsAPIService } from './newsapi.js';
import { AIContentGenerator } from './ai.js';
import { getCurrentDate } from './utils.js';
import { DailyContentSchema, type DailyContent } from './types.js';
import { 
  getDatabaseSize, 
  getNextAttack, 
  shouldDiscoverNewAttacks, 
  addNewAttacks 
} from './attackDatabase.js';
import { HistoryTracker } from './historyTracker.js';
import { AttackDiscoveryService } from './attackDiscovery.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the generator's .env file for local execution.
// On Vercel, environment variables will be provided directly.
dotenv.config({ path: join(__dirname, '../.env') });

export async function generateAndSaveContent(spinner: Ora) {
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
        } else {
          spinner.succeed('No new attack methodologies found');
        }
      } else {
        spinner.succeed('No new attack methodologies discovered');
      }
    } catch (error) {
      spinner.warn('Failed to discover new attacks, continuing with existing database');
      console.log(chalk.yellow('Will continue with existing attack methodologies'));
    }
  }

  // Select next attack methodology
  spinner.start('Selecting attack methodology...');

  const currentDate = getCurrentDate();
  const contentDir = join(__dirname, '../../../content');
  const filePath = join(contentDir, `${currentDate}.json`);

  // Check if content already exists for today
  let existingAttackId: string | null = null;
  try {
    const { readFileSync } = await import('fs');
    const { parse } = await import('json5'); // Use json5 for flexible parsing if needed
    const existingContent = readFileSync(filePath, 'utf-8');
    const parsed = parse(existingContent);
    existingAttackId = parsed.metadata?.attackId;
    if (existingAttackId) {
      console.log(chalk.yellow(`Existing content found for ${currentDate}. Forcing different attack...`));
      // Temporarily add existing attack to recent to avoid selecting the same
      recentAttackIds = [...recentAttackIds, existingAttackId];
    }
  } catch (error) {
    // File doesn't exist or can't be read/parsed - proceed normally
  }

  const selectedAttack = getNextAttack(recentAttackIds);
  spinner.succeed(`Selected: ${selectedAttack.name}`);
  console.log(chalk.blue(`📚 Category: ${selectedAttack.category}`));
  console.log(chalk.blue(`🎯 Difficulty: ${selectedAttack.difficulty}`));

  // Fetch news articles for this specific attack
  spinner.start(`Searching for news about ${selectedAttack.name}...`);
  const articles = await newsService.fetchNewsForAttack(selectedAttack);
  
  if (articles.length === 0) {
    spinner.warn('No recent news found for this attack type');
    console.log(chalk.yellow('Falling back to general cybersecurity news...'));
    // Fallback to general news if no specific articles found
    const generalArticles = await newsService.fetchCybersecurityNews();
    articles.push(...generalArticles.slice(0, 3));
  }
  spinner.succeed(`Found ${articles.length} relevant articles`);

  // Display the top news article
  if (articles.length > 0) {
    console.log(chalk.gray(`📰 Top article: "${articles[0].title}" - ${articles[0].source.name}`));
  }

  // Generate content using the attack methodology and news context
  spinner.start('Generating educational content...');
  const [blueTeamContent, redTeamContent] = await Promise.all([
    aiService.generateBlueTeamContent(selectedAttack, articles),
    aiService.generateRedTeamContent(selectedAttack, articles),
  ]);

  const dailyContent: DailyContent = {
    date: currentDate,
    attackType: selectedAttack.name as any, // We'll need to update the types
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
    } as any, // We'll need to update the types
  };

  const validatedContent = DailyContentSchema.parse(dailyContent);

  await mkdir(contentDir, { recursive: true });
  await writeFile(filePath, JSON.stringify(validatedContent, null, 2), 'utf-8');
  
  // Update history
  await historyTracker.addAttackId(selectedAttack.id);
  
  spinner.succeed('Content generated successfully!');
  console.log(chalk.green(`📅 ${currentDate} - ${selectedAttack.name}`));
  console.log(chalk.green(`📊 Total attacks covered: ${historyTracker.getGenerationCount()}/${getDatabaseSize()}`));
} 
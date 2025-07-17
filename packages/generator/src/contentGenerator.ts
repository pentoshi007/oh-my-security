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
  addNewAttacks, 
  AttackMethodology 
} from './attackDatabase.js';
import { HistoryTracker } from './historyTracker.js';
import { AttackDiscoveryService } from './attackDiscovery.js';
import { NewsAPIArticle } from './types.js';

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

  let selectedAttack: AttackMethodology | undefined;
  let articles: NewsAPIArticle[] = [];
  let attempts = 0;
  const maxAttempts = 5;
  const skippedAttacks: string[] = [];

  while (attempts < maxAttempts) {
    attempts++;
    selectedAttack = getNextAttack(recentAttackIds);
    if (!selectedAttack) {
      throw new Error('No attack methodology available');
    }
    spinner.text = `Selecting attack methodology (attempt ${attempts})...`;
    spinner.succeed(`Selected: ${selectedAttack.name}`);
    console.log(chalk.blue(`
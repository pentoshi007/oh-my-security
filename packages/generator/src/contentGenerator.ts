import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import type { Ora } from 'ora';
import chalk from 'chalk';
import dotenv from 'dotenv';

import { NewsAPIService } from './newsapi.js';
import { AIContentGenerator } from './ai.js';
import { getCurrentDate, detectAttackType } from './utils.js';
import { DailyContentSchema, type DailyContent } from './types.js';

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

  spinner.start('Fetching cybersecurity news...');
  const articles = await newsService.fetchCybersecurityNews();
  const bestArticle = newsService.selectBestArticle(articles);
  spinner.succeed('News fetched');

  const attackType = detectAttackType(bestArticle.title, bestArticle.description || '');
  const articleSummary = bestArticle.description || bestArticle.title;

  spinner.start('Generating content...');
  const [blueTeamContent, redTeamContent] = await Promise.all([
    aiService.generateBlueTeamContent(attackType, articleSummary),
    aiService.generateRedTeamContent(attackType, articleSummary),
  ]);

  const currentDate = getCurrentDate();
  const dailyContent: DailyContent = {
    date: currentDate,
    attackType,
    article: {
      title: bestArticle.title,
      url: bestArticle.url,
      source: bestArticle.source.name,
      publishedAt: bestArticle.publishedAt,
      summary: articleSummary,
    },
    content: {
      blueTeam: blueTeamContent,
      redTeam: redTeamContent,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
    },
  };

  const validatedContent = DailyContentSchema.parse(dailyContent);

  const contentDir = join(__dirname, '../../../content');
  await mkdir(contentDir, { recursive: true });
  const filePath = join(contentDir, `${currentDate}.json`);
  await writeFile(filePath, JSON.stringify(validatedContent, null, 2), 'utf-8');
  
  spinner.succeed('Content generated successfully!');
  console.log(chalk.green(`📅 ${currentDate} - ${attackType}`));
} 
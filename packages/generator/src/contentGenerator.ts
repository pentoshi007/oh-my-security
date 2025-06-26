import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import chalk from 'chalk';
import dotenv from 'dotenv';

import { NewsAPIService } from './newsapi.js';
import { AIContentGenerator } from './ai.js';
import { getCurrentDate, detectAttackType } from './utils.js';
import { DailyContentSchema, type DailyContent } from './types.js';

dotenv.config({ path: join(__dirname, '../../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateAndSaveContent(spinner: ora.Ora) {
  const newsApiKey = process.env.NEWS_API_KEY;
  const hfToken = process.env.HF_TOKEN;

  if (!newsApiKey || !hfToken) {
    spinner.fail('Missing API keys');
    console.error(chalk.red('Ensure NEWS_API_KEY and HF_TOKEN are set in the root .env file.'));
    throw new Error('Missing API keys');
  }

  const newsService = new NewsAPIService(newsApiKey);
  const aiService = new AIContentGenerator(hfToken);

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
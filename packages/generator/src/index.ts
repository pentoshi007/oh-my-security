import 'dotenv/config';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';

import { NewsAPIService } from './newsapi.js';
import { AIContentGenerator } from './ai.js';
import { getCurrentDate, detectAttackType } from './utils.js';
import { DailyContentSchema, type DailyContent } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log(chalk.blue.bold('🛡️  Oh-My-Security Content Generator'));
  
  const newsApiKey = process.env.NEWS_API_KEY;
  const hfToken = process.env.HF_TOKEN;

  if (!newsApiKey || !hfToken) {
    console.error(chalk.red('❌ Missing API keys'));
    console.log('Set NEWS_API_KEY and HF_TOKEN in .env file');
    process.exit(1);
  }

  const currentDate = getCurrentDate();
  const spinner = ora();

  try {
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

  } catch (error) {
    spinner.fail('Generation failed');
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    process.exit(1);
  }
}

main(); 
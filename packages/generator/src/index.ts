import ora from 'ora';
import { generateAndSaveContent } from './contentGenerator.js';

async function run() {
  console.log('Oh-My-Security Content Generator');
  
  const spinner = ora('Initializing...').start();
  
  try {
    await generateAndSaveContent(spinner);
  } catch (error) {
    spinner.fail('An unexpected error occurred.');
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

run(); 
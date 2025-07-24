import ora from 'ora';
import { generateDailyContent } from './contentGenerator.js';
import { storeContentInSupabase } from '@oms/supabase-client';
async function run() {
    console.log('Oh-My-Security Content Generator');
    const spinner = ora('Initializing...').start();
    try {
        const content = await generateDailyContent(spinner);
        spinner.info('Content generated, storing in Supabase...');
        await storeContentInSupabase(content);
        spinner.succeed('Content stored in Supabase successfully!');
    }
    catch (error) {
        spinner.fail('An unexpected error occurred.');
        if (error instanceof Error) {
            console.error(error.message);
            console.error(error.stack);
        }
    }
}
run();
//# sourceMappingURL=index.js.map
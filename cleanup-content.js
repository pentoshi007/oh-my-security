#!/usr/bin/env node

/**
 * Content Cleanup Script
 * 
 * This script cleans up old content files to maintain a 20-day retention period.
 * It works with both filesystem and Supabase storage.
 * 
 * Usage:
 *   node cleanup-content.js [options]
 * 
 * Options:
 *   --days=20        Retention period in days (default: 20)
 *   --dry-run        Show what would be deleted without actually deleting
 *   --verbose, -v    Show detailed output
 *   --help, -h       Show this help message
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the cleanup service
const { ContentCleanupService } = await import('./packages/generator/dist/contentCleanup.js');

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose') || args.includes('-v');
const help = args.includes('--help') || args.includes('-h');
const retentionDays = parseInt(args.find(arg => arg.startsWith('--days='))?.split('=')[1] || '20');

if (help) {
  console.log(chalk.blue('Content Cleanup Script'));
  console.log('');
  console.log('This script cleans up old content files to maintain a retention period.');
  console.log('');
  console.log('Usage:');
  console.log('  node cleanup-content.js [options]');
  console.log('');
  console.log('Options:');
  console.log('  --days=20        Retention period in days (default: 20)');
  console.log('  --dry-run        Show what would be deleted without actually deleting');
  console.log('  --verbose, -v    Show detailed output');
  console.log('  --help, -h       Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node cleanup-content.js --days=30 --verbose');
  console.log('  node cleanup-content.js --dry-run');
  process.exit(0);
}

console.log(chalk.blue('🧹 Content Cleanup Utility'));
console.log(chalk.blue(`Retention period: ${retentionDays} days`));
console.log(chalk.blue(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`));
console.log(chalk.blue(`Verbose: ${verbose ? 'ON' : 'OFF'}`));
console.log('');

// Create cleanup service
const cleanup = new ContentCleanupService({ 
  retentionDays, 
  dryRun, 
  verbose 
});

try {
  // Show current stats
  console.log(chalk.blue('--- Current Content Stats ---'));
  const stats = await cleanup.getContentStats();
  console.log(chalk.blue(`Total files: ${stats.totalFiles}`));
  console.log(chalk.blue(`Date range: ${stats.oldestDate || 'N/A'} to ${stats.newestDate || 'N/A'}`));
  console.log(chalk.blue(`Files to delete: ${stats.filesToDelete}`));
  console.log('');

  // Run cleanup
  const result = await cleanup.cleanupOldContent();
  
  // Show results
  if (result.errors.length > 0) {
    console.error(chalk.red(`\n❌ Cleanup completed with ${result.errors.length} errors`));
    result.errors.forEach(error => console.error(chalk.red(`  • ${error}`)));
    process.exit(1);
  } else {
    console.log(chalk.green(`\n✅ Cleanup completed successfully`));
    console.log(chalk.green(`  • Deleted: ${result.deleted.length} files`));
    console.log(chalk.green(`  • Kept: ${result.kept.length} files`));
    
    if (dryRun) {
      console.log(chalk.yellow('\n⚠️  This was a dry run - no files were actually deleted'));
    }
  }
} catch (error) {
  console.error(chalk.red(`\n❌ Cleanup failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
  process.exit(1);
}
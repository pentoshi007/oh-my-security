import { join } from 'path';
import { readdir, unlink, stat } from 'fs/promises';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export interface ContentCleanupOptions {
  retentionDays?: number;
  dryRun?: boolean;
  verbose?: boolean;
}

export class ContentCleanupService {
  private contentDir: string;
  private retentionDays: number;
  private dryRun: boolean;
  private verbose: boolean;

  constructor(options: ContentCleanupOptions = {}) {
    this.contentDir = join(__dirname, '../../../content');
    this.retentionDays = options.retentionDays || 20;
    this.dryRun = options.dryRun || false;
    this.verbose = options.verbose || false;
  }

  /**
   * Clean up old content files, keeping only the specified number of days
   */
  async cleanupOldContent(): Promise<{ deleted: string[], kept: string[], errors: string[] }> {
    const deleted: string[] = [];
    const kept: string[] = [];
    const errors: string[] = [];

    try {
      // Check if content directory exists
      try {
        await stat(this.contentDir);
      } catch (error) {
        if (this.verbose) {
          console.log(chalk.yellow(`Content directory not found: ${this.contentDir}`));
        }
        return { deleted, kept, errors };
      }

      // Read all files in content directory
      const files = await readdir(this.contentDir);
      const jsonFiles = files.filter(file => file.endsWith('.json') && file !== '.generation-history.json');
      
      if (jsonFiles.length === 0) {
        if (this.verbose) {
          console.log(chalk.yellow('No content files found to clean up'));
        }
        return { deleted, kept, errors };
      }

      // Sort files by date (newest first)
      const sortedFiles = jsonFiles.sort((a, b) => {
        const dateA = this.extractDateFromFilename(a);
        const dateB = this.extractDateFromFilename(b);
        return dateB.getTime() - dateA.getTime();
      });

      // Calculate cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      if (this.verbose) {
        console.log(chalk.blue(`Retention period: ${this.retentionDays} days`));
        console.log(chalk.blue(`Cutoff date: ${cutoffDate.toISOString().split('T')[0]}`));
        console.log(chalk.blue(`Found ${sortedFiles.length} content files`));
      }

      // Process each file
      for (const file of sortedFiles) {
        try {
          const fileDate = this.extractDateFromFilename(file);
          const filePath = join(this.contentDir, file);

          if (fileDate < cutoffDate) {
            // File is older than retention period - delete it
            if (!this.dryRun) {
              await unlink(filePath);
            }
            deleted.push(file);
            
            if (this.verbose) {
              const action = this.dryRun ? 'Would delete' : 'Deleted';
              console.log(chalk.red(`${action}: ${file} (${fileDate.toISOString().split('T')[0]})`));
            }
          } else {
            // File is within retention period - keep it
            kept.push(file);
            
            if (this.verbose) {
              console.log(chalk.green(`Keeping: ${file} (${fileDate.toISOString().split('T')[0]})`));
            }
          }
        } catch (error) {
          const errorMsg = `Error processing file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          
          if (this.verbose) {
            console.log(chalk.red(errorMsg));
          }
        }
      }

      // Summary
      if (this.verbose) {
        console.log(chalk.blue('\n--- Cleanup Summary ---'));
        console.log(chalk.green(`Kept: ${kept.length} files`));
        console.log(chalk.red(`Deleted: ${deleted.length} files`));
        if (errors.length > 0) {
          console.log(chalk.yellow(`Errors: ${errors.length} files`));
        }
      }

    } catch (error) {
      const errorMsg = `Error during cleanup: ${error instanceof Error ? error.message : 'Unknown error'}`;
      errors.push(errorMsg);
      
      if (this.verbose) {
        console.log(chalk.red(errorMsg));
      }
    }

    return { deleted, kept, errors };
  }

  /**
   * Extract date from filename (assumes format: YYYY-MM-DD.json)
   */
  private extractDateFromFilename(filename: string): Date {
    const dateStr = filename.replace('.json', '');
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date format in filename: ${filename}`);
    }
    
    return date;
  }

  /**
   * Get content statistics
   */
  async getContentStats(): Promise<{ totalFiles: number, oldestDate: string | null, newestDate: string | null, filesToDelete: number }> {
    try {
      const files = await readdir(this.contentDir);
      const jsonFiles = files.filter(file => file.endsWith('.json') && file !== '.generation-history.json');
      
      if (jsonFiles.length === 0) {
        return { totalFiles: 0, oldestDate: null, newestDate: null, filesToDelete: 0 };
      }

      const sortedFiles = jsonFiles.sort((a, b) => {
        const dateA = this.extractDateFromFilename(a);
        const dateB = this.extractDateFromFilename(b);
        return dateB.getTime() - dateA.getTime();
      });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      const filesToDelete = sortedFiles.filter(file => {
        const fileDate = this.extractDateFromFilename(file);
        return fileDate < cutoffDate;
      }).length;

      const newestDate = sortedFiles.length > 0 ? this.extractDateFromFilename(sortedFiles[0]).toISOString().split('T')[0] : null;
      const oldestDate = sortedFiles.length > 0 ? this.extractDateFromFilename(sortedFiles[sortedFiles.length - 1]).toISOString().split('T')[0] : null;

      return {
        totalFiles: jsonFiles.length,
        oldestDate,
        newestDate,
        filesToDelete
      };
    } catch (error) {
      console.error('Error getting content stats:', error);
      return { totalFiles: 0, oldestDate: null, newestDate: null, filesToDelete: 0 };
    }
  }
}

/**
 * Standalone function to clean up content
 */
export async function cleanupContent(options: ContentCleanupOptions = {}): Promise<void> {
  const cleanup = new ContentCleanupService(options);
  const result = await cleanup.cleanupOldContent();
  
  if (result.errors.length > 0) {
    console.error(chalk.red(`Cleanup completed with ${result.errors.length} errors`));
    result.errors.forEach(error => console.error(chalk.red(error)));
  } else {
    console.log(chalk.green(`Cleanup completed successfully: ${result.deleted.length} files deleted, ${result.kept.length} files kept`));
  }
}

/**
 * CLI function for manual cleanup
 */
export async function runContentCleanup(): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const retentionDays = parseInt(args.find(arg => arg.startsWith('--days='))?.split('=')[1] || '20');

  console.log(chalk.blue('🧹 Content Cleanup Utility'));
  console.log(chalk.blue(`Retention period: ${retentionDays} days`));
  console.log(chalk.blue(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`));
  console.log(chalk.blue(`Verbose: ${verbose ? 'ON' : 'OFF'}`));
  console.log('');

  const cleanup = new ContentCleanupService({ retentionDays, dryRun, verbose });
  
  // Show stats first
  const stats = await cleanup.getContentStats();
  console.log(chalk.blue('--- Current Content Stats ---'));
  console.log(chalk.blue(`Total files: ${stats.totalFiles}`));
  console.log(chalk.blue(`Date range: ${stats.oldestDate || 'N/A'} to ${stats.newestDate || 'N/A'}`));
  console.log(chalk.blue(`Files to delete: ${stats.filesToDelete}`));
  console.log('');

  // Run cleanup
  const result = await cleanup.cleanupOldContent();
  
  if (result.errors.length > 0) {
    console.error(chalk.red(`\n❌ Cleanup completed with ${result.errors.length} errors`));
    result.errors.forEach(error => console.error(chalk.red(`  • ${error}`)));
  } else {
    console.log(chalk.green(`\n✅ Cleanup completed successfully`));
    console.log(chalk.green(`  • Deleted: ${result.deleted.length} files`));
    console.log(chalk.green(`  • Kept: ${result.kept.length} files`));
  }
}

// Run cleanup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runContentCleanup().catch(console.error);
}
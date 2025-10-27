import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GenerationHistory {
  recentAttackIds: string[]; // Last 30 attack IDs used
  lastGenerated: string; // ISO date string
  generationCount: number;
  categoryHistory: { [category: string]: string[] }; // Track recent attacks by category
  difficultyHistory: { [difficulty: string]: string[] }; // Track recent attacks by difficulty
}

const HISTORY_FILE = join(__dirname, '../../../content/.generation-history.json');
const MAX_HISTORY_SIZE = 30; // Keep track of last 30 attacks to avoid repetition

export class HistoryTracker {
  private history: GenerationHistory;

  constructor() {
    this.history = {
      recentAttackIds: [],
      lastGenerated: new Date().toISOString(),
      generationCount: 0,
      categoryHistory: {},
      difficultyHistory: {}
    };
  }

  async load(): Promise<void> {
    try {
      const data = await readFile(HISTORY_FILE, 'utf-8');
      this.history = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is corrupted, use defaults
      console.log('No history file found, starting fresh');
    }
  }

  async save(): Promise<void> {
    const dir = dirname(HISTORY_FILE);
    await mkdir(dir, { recursive: true });
    await writeFile(HISTORY_FILE, JSON.stringify(this.history, null, 2), 'utf-8');
  }

  getRecentAttackIds(): string[] {
    return [...this.history.recentAttackIds];
  }

  async addAttackId(attackId: string, attackCategory?: string, attackDifficulty?: string): Promise<void> {
    // Add to beginning of array
    this.history.recentAttackIds.unshift(attackId);
    
    // Keep only the last MAX_HISTORY_SIZE items
    if (this.history.recentAttackIds.length > MAX_HISTORY_SIZE) {
      this.history.recentAttackIds = this.history.recentAttackIds.slice(0, MAX_HISTORY_SIZE);
    }
    
    // Track by category
    if (attackCategory) {
      if (!this.history.categoryHistory[attackCategory]) {
        this.history.categoryHistory[attackCategory] = [];
      }
      this.history.categoryHistory[attackCategory].unshift(attackId);
      
      // Keep only last 10 per category
      if (this.history.categoryHistory[attackCategory].length > 10) {
        this.history.categoryHistory[attackCategory] = this.history.categoryHistory[attackCategory].slice(0, 10);
      }
    }
    
    // Track by difficulty
    if (attackDifficulty) {
      if (!this.history.difficultyHistory[attackDifficulty]) {
        this.history.difficultyHistory[attackDifficulty] = [];
      }
      this.history.difficultyHistory[attackDifficulty].unshift(attackId);
      
      // Keep only last 10 per difficulty
      if (this.history.difficultyHistory[attackDifficulty].length > 10) {
        this.history.difficultyHistory[attackDifficulty] = this.history.difficultyHistory[attackDifficulty].slice(0, 10);
      }
    }
    
    this.history.lastGenerated = new Date().toISOString();
    this.history.generationCount++;
    
    await this.save();
  }

  getGenerationCount(): number {
    return this.history.generationCount;
  }

  getLastGeneratedDate(): string {
    return this.history.lastGenerated;
  }

  // Check if we've covered all attacks at least once
  hasCompletedCycle(totalAttacks: number): boolean {
    return this.history.generationCount >= totalAttacks;
  }

  // Get recent attacks by category
  getRecentAttacksByCategory(category: string): string[] {
    return [...(this.history.categoryHistory[category] || [])];
  }

  // Get recent attacks by difficulty
  getRecentAttacksByDifficulty(difficulty: string): string[] {
    return [...(this.history.difficultyHistory[difficulty] || [])];
  }

  // Get category distribution in recent history
  getCategoryDistribution(): { [category: string]: number } {
    const distribution: { [category: string]: number } = {};
    Object.keys(this.history.categoryHistory).forEach(category => {
      distribution[category] = this.history.categoryHistory[category].length;
    });
    return distribution;
  }

  // Clear history (useful for testing or resetting)
  async reset(): Promise<void> {
    this.history = {
      recentAttackIds: [],
      lastGenerated: new Date().toISOString(),
      generationCount: 0,
      categoryHistory: {},
      difficultyHistory: {}
    };
    await this.save();
  }
} 
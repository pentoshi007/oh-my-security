import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface GenerationHistory {
  recentAttackIds: string[]; // Last 30 attack IDs used
  lastGenerated: string; // ISO date string
  generationCount: number;
}

const HISTORY_FILE = join(__dirname, '../../../content/.generation-history.json');
const MAX_HISTORY_SIZE = 30; // Keep track of last 30 attacks to avoid repetition

export class HistoryTracker {
  private history: GenerationHistory;

  constructor() {
    this.history = {
      recentAttackIds: [],
      lastGenerated: new Date().toISOString(),
      generationCount: 0
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

  async addAttackId(attackId: string): Promise<void> {
    // Add to beginning of array
    this.history.recentAttackIds.unshift(attackId);
    
    // Keep only the last MAX_HISTORY_SIZE items
    if (this.history.recentAttackIds.length > MAX_HISTORY_SIZE) {
      this.history.recentAttackIds = this.history.recentAttackIds.slice(0, MAX_HISTORY_SIZE);
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

  // Clear history (useful for testing or resetting)
  async reset(): Promise<void> {
    this.history = {
      recentAttackIds: [],
      lastGenerated: new Date().toISOString(),
      generationCount: 0
    };
    await this.save();
  }
} 
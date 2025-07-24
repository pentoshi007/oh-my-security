import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const HISTORY_FILE = join(__dirname, '../../../content/.generation-history.json');
const MAX_HISTORY_SIZE = 30; // Keep track of last 30 attacks to avoid repetition
export class HistoryTracker {
    constructor() {
        this.history = {
            recentAttackIds: [],
            lastGenerated: new Date().toISOString(),
            generationCount: 0
        };
    }
    async load() {
        try {
            const data = await readFile(HISTORY_FILE, 'utf-8');
            this.history = JSON.parse(data);
        }
        catch (error) {
            // File doesn't exist or is corrupted, use defaults
            console.log('No history file found, starting fresh');
        }
    }
    async save() {
        const dir = dirname(HISTORY_FILE);
        await mkdir(dir, { recursive: true });
        await writeFile(HISTORY_FILE, JSON.stringify(this.history, null, 2), 'utf-8');
    }
    getRecentAttackIds() {
        return [...this.history.recentAttackIds];
    }
    async addAttackId(attackId) {
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
    getGenerationCount() {
        return this.history.generationCount;
    }
    getLastGeneratedDate() {
        return this.history.lastGenerated;
    }
    // Check if we've covered all attacks at least once
    hasCompletedCycle(totalAttacks) {
        return this.history.generationCount >= totalAttacks;
    }
    // Clear history (useful for testing or resetting)
    async reset() {
        this.history = {
            recentAttackIds: [],
            lastGenerated: new Date().toISOString(),
            generationCount: 0
        };
        await this.save();
    }
}
//# sourceMappingURL=historyTracker.js.map
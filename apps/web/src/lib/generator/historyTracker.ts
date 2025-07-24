import { createClient } from '@supabase/supabase-js';

export class HistoryTracker {
    private supabase;
    private recentAttackIds: string[] = [];

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async load(): Promise<void> {
        try {
            // Get the last 20 attack IDs from Supabase
            const { data, error } = await this.supabase
                .from('daily_content')
                .select('attack_id')
                .order('date', { ascending: false })
                .limit(20);

            if (error) {
                console.warn('Failed to load history from Supabase:', error);
                this.recentAttackIds = [];
                return;
            }

            this.recentAttackIds = data
                .map(item => item.attack_id)
                .filter(id => id !== null);

            console.log(`Loaded ${this.recentAttackIds.length} recent attack IDs from history`);
        } catch (error) {
            console.warn('Error loading history:', error);
            this.recentAttackIds = [];
        }
    }

    async addAttackId(attackId: string): Promise<void> {
        // Add to local array
        this.recentAttackIds.unshift(attackId);

        // Keep only the last 20
        if (this.recentAttackIds.length > 20) {
            this.recentAttackIds = this.recentAttackIds.slice(0, 20);
        }

        // Note: The attack ID will be saved to Supabase when the content is saved
        // in the main generation function, so we don't need to save it here
    }

    getRecentAttackIds(): string[] {
        return [...this.recentAttackIds];
    }

    getGenerationCount(): number {
        return this.recentAttackIds.length;
    }
}
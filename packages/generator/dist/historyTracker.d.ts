export declare class HistoryTracker {
    private history;
    constructor();
    load(): Promise<void>;
    save(): Promise<void>;
    getRecentAttackIds(): string[];
    addAttackId(attackId: string, attackCategory?: string, attackDifficulty?: string): Promise<void>;
    getGenerationCount(): number;
    getLastGeneratedDate(): string;
    hasCompletedCycle(totalAttacks: number): boolean;
    getRecentAttacksByCategory(category: string): string[];
    getRecentAttacksByDifficulty(difficulty: string): string[];
    getCategoryDistribution(): {
        [category: string]: number;
    };
    reset(): Promise<void>;
}
//# sourceMappingURL=historyTracker.d.ts.map
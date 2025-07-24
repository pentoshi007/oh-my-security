export declare class HistoryTracker {
    private history;
    constructor();
    load(): Promise<void>;
    save(): Promise<void>;
    getRecentAttackIds(): string[];
    addAttackId(attackId: string): Promise<void>;
    getGenerationCount(): number;
    getLastGeneratedDate(): string;
    hasCompletedCycle(totalAttacks: number): boolean;
    reset(): Promise<void>;
}
//# sourceMappingURL=historyTracker.d.ts.map
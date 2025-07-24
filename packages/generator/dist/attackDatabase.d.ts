export interface AttackMethodology {
    id: string;
    name: string;
    category: string;
    description: string;
    searchKeywords: string[];
    aliases: string[];
    difficulty: 'Low' | 'Medium' | 'High';
    impacts: string[];
}
export declare const ATTACK_DATABASE: AttackMethodology[];
export declare function getAttackCategories(): string[];
export declare function getAttacksByCategory(category: string): AttackMethodology[];
export declare function getAttackById(id: string): AttackMethodology | undefined;
export declare function getNextAttack(recentlyUsedIds: string[]): AttackMethodology;
export declare function searchAttacks(query: string): AttackMethodology[];
export declare function addNewAttack(attack: AttackMethodology): boolean;
export declare function addNewAttacks(attacks: AttackMethodology[]): number;
export declare function getDatabaseSize(): number;
export declare function getAllAttacks(): AttackMethodology[];
export declare function resetToOriginalDatabase(): void;
export declare function shouldDiscoverNewAttacks(recentlyUsedIds: string[]): boolean;
//# sourceMappingURL=attackDatabase.d.ts.map
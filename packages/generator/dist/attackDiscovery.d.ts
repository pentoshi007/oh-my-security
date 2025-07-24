import { type AttackMethodology } from './attackDatabase.js';
interface DiscoveredAttack {
    name: string;
    description: string;
    category: string;
    confidence: number;
    sources: string[];
    keywords: string[];
}
export declare class AttackDiscoveryService {
    private newsApiKey;
    private minConfidence;
    constructor(newsApiKey: string);
    /**
     * Discover new attack methodologies from recent cybersecurity news
     */
    discoverNewAttacks(): Promise<DiscoveredAttack[]>;
    /**
     * Search news for cybersecurity content
     */
    private searchNews;
    /**
     * Extract potential attack methodologies from news articles
     */
    private extractAttackMethodologies;
    /**
     * Analyze text for potential new attack methodologies
     */
    private analyzeTextForAttacks;
    /**
     * Calculate confidence score for a potential attack
     */
    private calculateConfidence;
    /**
     * Format attack name to standard format
     */
    private formatAttackName;
    /**
     * Extract description from surrounding context
     */
    private extractDescription;
    /**
     * Categorize the attack based on context
     */
    private categorizeAttack;
    /**
     * Extract relevant keywords for news searching
     */
    private extractKeywords;
    /**
     * Remove duplicates and filter by confidence
     */
    private deduplicateAndFilter;
    /**
     * Convert discovered attack to AttackMethodology format
     */
    convertToAttackMethodology(discovered: DiscoveredAttack): AttackMethodology;
    /**
     * Get date from N days ago
     */
    private getDateDaysAgo;
}
export {};
//# sourceMappingURL=attackDiscovery.d.ts.map
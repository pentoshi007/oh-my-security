import axios from 'axios';
import { ATTACK_DATABASE } from './attackDatabase.js';
export class AttackDiscoveryService {
    constructor(newsApiKey) {
        this.minConfidence = 0.7; // Minimum confidence to consider a new attack
        this.newsApiKey = newsApiKey;
    }
    /**
     * Discover new attack methodologies from recent cybersecurity news
     */
    async discoverNewAttacks() {
        console.log('🔍 Scanning for new attack methodologies...');
        const discoveries = [];
        try {
            // Search for various cybersecurity terms that might indicate new attacks
            const searchQueries = [
                'new cybersecurity threat',
                'novel attack technique',
                'zero-day vulnerability',
                'emerging cyber threat',
                'latest hacking method',
                'cybersecurity researchers discover',
                'new malware family',
                'advanced persistent threat',
                'cyber attack technique'
            ];
            for (const query of searchQueries) {
                const articles = await this.searchNews(query);
                const extracted = await this.extractAttackMethodologies(articles);
                discoveries.push(...extracted);
            }
            // Remove duplicates and filter by confidence
            const uniqueDiscoveries = this.deduplicateAndFilter(discoveries);
            console.log(`📊 Found ${uniqueDiscoveries.length} potential new attack methodologies`);
            return uniqueDiscoveries;
        }
        catch (error) {
            console.error('Error during attack discovery:', error);
            return [];
        }
    }
    /**
     * Search news for cybersecurity content
     */
    async searchNews(query) {
        try {
            const response = await axios.get('https://newsapi.org/v2/everything', {
                params: {
                    q: query,
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 20,
                    from: this.getDateDaysAgo(30), // Last 30 days
                },
                headers: {
                    'X-API-Key': this.newsApiKey,
                },
            });
            return response.data.articles || [];
        }
        catch (error) {
            console.error(`Error searching news for "${query}":`, error);
            return [];
        }
    }
    /**
     * Extract potential attack methodologies from news articles
     */
    async extractAttackMethodologies(articles) {
        const discoveries = [];
        for (const article of articles) {
            const text = `${article.title} ${article.description || ''} ${article.content || ''}`;
            const extracted = this.analyzeTextForAttacks(text, article.url);
            discoveries.push(...extracted);
        }
        return discoveries;
    }
    /**
     * Analyze text for potential new attack methodologies
     */
    analyzeTextForAttacks(text, sourceUrl) {
        var _a;
        const discoveries = [];
        const lowerText = text.toLowerCase();
        // Patterns that indicate new attack types
        const attackPatterns = [
            // New attack type patterns
            /new\s+(?:type of\s+)?(?:cyber\s*)?attack(?:\s+called|\s+named|\s+dubbed)?\s+[""']?([^""'\n,]+)[""']?/gi,
            /researchers\s+(?:have\s+)?discovered\s+(?:a\s+)?(?:new\s+)?(?:attack\s+)?(?:technique\s+)?(?:called\s+)?[""']?([^""'\n,]+)[""']?/gi,
            /(?:novel|new|emerging)\s+(?:attack\s+)?(?:method|technique|vector)\s+(?:called\s+)?[""']?([^""'\n,]+)[""']?/gi,
            /hackers\s+(?:are\s+)?using\s+(?:a\s+)?(?:new\s+)?(?:technique\s+)?(?:called\s+)?[""']?([^""'\n,]+)[""']?/gi,
            /(?:malware|trojan|ransomware|virus)\s+(?:family\s+)?(?:called\s+)?[""']?([^""'\n,]+)[""']?/gi,
            // APT and campaign names
            /(?:apt|advanced persistent threat)\s+(?:group\s+)?[""']?([^""'\n,]+)[""']?/gi,
            /(?:operation|campaign)\s+[""']?([^""'\n,]+)[""']?/gi,
        ];
        for (const pattern of attackPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const attackName = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim();
                if (attackName && attackName.length > 3 && attackName.length < 50) {
                    const confidence = this.calculateConfidence(attackName, text);
                    if (confidence >= this.minConfidence) {
                        discoveries.push({
                            name: this.formatAttackName(attackName),
                            description: this.extractDescription(attackName, text),
                            category: this.categorizeAttack(attackName, text),
                            confidence,
                            sources: [sourceUrl],
                            keywords: this.extractKeywords(attackName, text)
                        });
                    }
                }
            }
        }
        return discoveries;
    }
    /**
     * Calculate confidence score for a potential attack
     */
    calculateConfidence(attackName, text) {
        let confidence = 0.5; // Base confidence
        const lowerName = attackName.toLowerCase();
        const lowerText = text.toLowerCase();
        // Check if it's already in our database
        const existingAttack = ATTACK_DATABASE.find(attack => attack.name.toLowerCase().includes(lowerName) ||
            attack.aliases.some(alias => alias.toLowerCase().includes(lowerName)) ||
            attack.searchKeywords.some(keyword => keyword.toLowerCase().includes(lowerName)));
        if (existingAttack) {
            return 0; // Already known
        }
        // Boost confidence for certain indicators
        if (lowerText.includes('researchers') || lowerText.includes('security experts'))
            confidence += 0.2;
        if (lowerText.includes('discovered') || lowerText.includes('identified'))
            confidence += 0.15;
        if (lowerText.includes('novel') || lowerText.includes('new') || lowerText.includes('emerging'))
            confidence += 0.1;
        if (lowerText.includes('cve-') || lowerText.includes('vulnerability'))
            confidence += 0.1;
        if (lowerText.includes('malware') || lowerText.includes('ransomware'))
            confidence += 0.1;
        // Reduce confidence for generic terms
        if (['attack', 'threat', 'malware', 'virus', 'hack'].includes(lowerName))
            confidence -= 0.3;
        if (lowerName.length < 5)
            confidence -= 0.2;
        return Math.min(1, Math.max(0, confidence));
    }
    /**
     * Format attack name to standard format
     */
    formatAttackName(name) {
        return name
            .replace(/[""']/g, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
    }
    /**
     * Extract description from surrounding context
     */
    extractDescription(attackName, text) {
        const sentences = text.split(/[.!?]+/);
        for (const sentence of sentences) {
            if (sentence.toLowerCase().includes(attackName.toLowerCase())) {
                return sentence.trim().substring(0, 200) + (sentence.length > 200 ? '...' : '');
            }
        }
        return `A newly discovered cybersecurity threat: ${attackName}`;
    }
    /**
     * Categorize the attack based on context
     */
    categorizeAttack(attackName, text) {
        const lowerName = attackName.toLowerCase();
        const lowerText = text.toLowerCase();
        if (lowerText.includes('ransomware') || lowerName.includes('ransom'))
            return 'Malware';
        if (lowerText.includes('phishing') || lowerName.includes('phish'))
            return 'Social Engineering';
        if (lowerText.includes('ddos') || lowerText.includes('denial of service'))
            return 'Network Attacks';
        if (lowerText.includes('sql') || lowerText.includes('xss') || lowerText.includes('injection'))
            return 'Web Application Attacks';
        if (lowerText.includes('apt') || lowerText.includes('advanced persistent'))
            return 'Advanced Attacks';
        if (lowerText.includes('iot') || lowerText.includes('smart device'))
            return 'IoT Attacks';
        if (lowerText.includes('crypto') || lowerText.includes('bitcoin') || lowerText.includes('blockchain'))
            return 'Cryptocurrency Attacks';
        if (lowerText.includes('social engineering') || lowerText.includes('human factor'))
            return 'Human Factor';
        return 'Emerging Threats';
    }
    /**
     * Extract relevant keywords for news searching
     */
    extractKeywords(attackName, text) {
        const keywords = [attackName];
        const words = text.toLowerCase().split(/\s+/);
        // Add relevant cybersecurity terms found in context
        const relevantTerms = [
            'vulnerability', 'exploit', 'malware', 'ransomware', 'trojan', 'backdoor',
            'phishing', 'social engineering', 'ddos', 'botnet', 'apt', 'zero-day',
            'injection', 'overflow', 'bypass', 'escalation', 'persistence'
        ];
        for (const term of relevantTerms) {
            if (words.includes(term) && !keywords.includes(term)) {
                keywords.push(term);
            }
        }
        return keywords.slice(0, 5); // Limit to 5 keywords
    }
    /**
     * Remove duplicates and filter by confidence
     */
    deduplicateAndFilter(discoveries) {
        const uniqueMap = new Map();
        for (const discovery of discoveries) {
            const key = discovery.name.toLowerCase();
            const existing = uniqueMap.get(key);
            if (!existing || discovery.confidence > existing.confidence) {
                // Merge sources if it's the same attack
                const sources = existing ? [...existing.sources, ...discovery.sources] : discovery.sources;
                uniqueMap.set(key, Object.assign(Object.assign({}, discovery), { sources: [...new Set(sources)] // Remove duplicate sources
                 }));
            }
        }
        return Array.from(uniqueMap.values())
            .filter(d => d.confidence >= this.minConfidence)
            .sort((a, b) => b.confidence - a.confidence);
    }
    /**
     * Convert discovered attack to AttackMethodology format
     */
    convertToAttackMethodology(discovered) {
        return {
            id: discovered.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: discovered.name,
            category: discovered.category,
            description: discovered.description,
            searchKeywords: discovered.keywords,
            aliases: [],
            difficulty: 'Medium', // Default difficulty for new attacks
            impacts: ['Unknown Impact'] // Will be updated when more info is available
        };
    }
    /**
     * Get date from N days ago
     */
    getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }
}
//# sourceMappingURL=attackDiscovery.js.map
import type { AttackMethodology } from './attackDatabase';
import type { NewsAPIArticle } from './ai';

export interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
}

export class NewsAPIService {
    private apiKey: string;
    private baseUrl = 'https://newsapi.org/v2';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async fetchNewsForAttack(attack: AttackMethodology): Promise<NewsAPIArticle[]> {
        // Try multiple search strategies to find relevant articles
        const searchStrategies = [
            // Strategy 1: Exact attack name with cybersecurity context
            `"${attack.name}" AND (cybersecurity OR "cyber attack" OR "security breach" OR "data breach" OR hacking OR malware OR vulnerability OR exploit)`,
            // Strategy 2: Primary search keywords with cybersecurity context (more specific)
            `(${attack.searchKeywords.slice(0, 3).map(term => `"${term}"`).join(' OR ')}) AND (cybersecurity OR "cyber attack" OR "security breach" OR "data breach" OR hacking OR malware OR vulnerability OR exploit)`,
            // Strategy 3: Broader search with attack name and category
            `"${attack.name}" AND "${attack.category.toLowerCase()}"`,
            // Strategy 4: Fallback to general cybersecurity news if specific searches fail
            'cybersecurity OR "cyber attack" OR "security breach" OR "data breach" OR hacking OR malware'
        ];

        let allArticles: NewsAPIArticle[] = [];
        const seenUrls = new Set<string>();

        // Try each search strategy
        for (const query of searchStrategies) {
            try {
                const articles = await this.searchNews(query);
                // Add unique articles
                articles.forEach(article => {
                    if (article.url && !seenUrls.has(article.url)) {
                        allArticles.push(article);
                        seenUrls.add(article.url);
                    }
                });
                
                // If we have enough relevant articles, stop trying more strategies
                if (allArticles.length >= 10) {
                    break;
                }
            } catch (error) {
                console.warn(`Search strategy failed: ${query}`, error);
                continue;
            }
        }

        // Score and filter articles for relevance
        const scoredArticles = allArticles
            .map(article => {
                const score = this.scoreArticleRelevance(article, attack);
                return { article, score };
            })
            .filter(item => item.score > 0) // Only accept articles that pass strict validation (score 0 = rejected)
            .sort((a, b) => b.score - a.score); // Sort by relevance

        // Return top 5 most relevant articles
        return scoredArticles.slice(0, 5).map(item => item.article);
    }

    async fetchCybersecurityNews(): Promise<NewsAPIArticle[]> {
        const queries = [
            'cybersecurity attack',
            'cyber security breach',
            'hacking incident',
            'data breach',
            'malware attack'
        ];

        for (const query of queries) {
            try {
                const articles = await this.searchNews(query);
                if (articles.length > 0) {
                    return articles;
                }
            } catch (error) {
                console.warn(`Failed to fetch general news for "${query}":`, error);
                continue;
            }
        }

        return [];
    }

    private async searchNews(query: string): Promise<NewsAPIArticle[]> {
        const params = new URLSearchParams({
            q: query,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: '15',
            apiKey: this.apiKey
        });

        const response = await fetch(`${this.baseUrl}/everything?${params}`);

        if (!response.ok) {
            throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
        }

        const data: NewsAPIResponse = await response.json();

        if (data.status !== 'ok') {
            throw new Error(`NewsAPI returned status: ${data.status}`);
        }

        // Filter out articles with null/empty descriptions
        return data.articles
            .filter(article =>
                article.description &&
                article.description.length > 50 &&
                !article.title.toLowerCase().includes('[removed]')
            );
    }

    /**
     * Score article relevance to the attack methodology
     * Returns 0 if article doesn't meet strict requirements
     */
    private scoreArticleRelevance(article: NewsAPIArticle, attack: AttackMethodology): number {
        const titleLower = article.title.toLowerCase();
        const descLower = (article.description || '').toLowerCase();
        const fullText = `${titleLower} ${descLower}`;

        // CRITICAL REQUIREMENT 1: Attack topic MUST be mentioned in title or description
        const hasAttackInTitleOrDesc = this.hasExactAttackMatch(fullText, attack);
        if (!hasAttackInTitleOrDesc) {
            // Topic not in title/description - REJECT immediately
            return 0;
        }

        // CRITICAL REQUIREMENT 2: Must have strong cybersecurity context
        const hasStrongCybersecurityContext = this.hasStrongCybersecurityContext(fullText);
        if (!hasStrongCybersecurityContext) {
            // No cybersecurity context - REJECT
            return 0;
        }

        // Both requirements met - calculate detailed relevance score
        let score = 100; // Base score for meeting strict requirements

        // High-value exact matches (attack name in title gets highest score)
        if (titleLower.includes(attack.name.toLowerCase())) score += 50;
        if (descLower.includes(attack.name.toLowerCase())) score += 25;
        
        // Check for aliases with high weight
        attack.aliases.forEach(alias => {
            if (titleLower.includes(alias.toLowerCase())) score += 8;
            if (descLower.includes(alias.toLowerCase())) score += 4;
        });
        
        // Check for search keywords with context-aware scoring
        attack.searchKeywords.forEach((keyword, index) => {
            const keywordLower = keyword.toLowerCase();
            const weight = Math.max(1, 4 - index); // First 3 keywords get higher weight
            
            // Check if keyword appears in cybersecurity context
            const hasCybersecurityContext = this.hasCybersecurityContext(fullText, keywordLower);
            
            if (titleLower.includes(keywordLower)) {
                score += hasCybersecurityContext ? weight * 2 : weight; // Reduced score without context
            }
            if (descLower.includes(keywordLower)) {
                score += hasCybersecurityContext ? weight : Math.floor(weight / 2); // Reduced score without context
            }
        });
        
        // Check for category-related terms
        const categoryTerms = attack.category.toLowerCase().split(' ');
        categoryTerms.forEach(term => {
            if (titleLower.includes(term)) score += 2;
            if (descLower.includes(term)) score += 1;
        });
        
        // Check for impact-related terms
        attack.impacts.forEach(impact => {
            const impactLower = impact.toLowerCase();
            if (titleLower.includes(impactLower)) score += 3;
            if (descLower.includes(impactLower)) score += 2;
        });
        
        // Boost for reputable cybersecurity sources
        const cybersecuritySources = [
            'reuters', 'bbc', 'cnn', 'techcrunch', 'wired', 'ars technica', 'zdnet', 
            'bleeping computer', 'the hacker news', 'krebs on security', 'dark reading',
            'security week', 'threat post', 'infosecurity magazine', 'cyber security news'
        ];
        if (cybersecuritySources.some(source => 
            article.source.name.toLowerCase().includes(source)
        )) {
            score += 3;
        }
        
        // Heavy penalty for irrelevant terms and contexts
        const irrelevantTerms = ['sports', 'entertainment', 'politics', 'weather', 'celebrity', 'gossip'];
        if (irrelevantTerms.some(term => fullText.includes(term))) {
            score -= 10; // Increased penalty
        }
        
        // Heavy penalty for legal/medical contexts that might match keywords incorrectly
        const nonCybersecurityContexts = [
            'attorney-client privilege', 'legal privilege', 'medical privilege', 'doctor-patient privilege',
            'court upholds', 'legal case', 'lawsuit', 'litigation', 'legal proceedings',
            'medical malpractice', 'healthcare', 'insurance', 'financial services'
        ];
        if (nonCybersecurityContexts.some(context => fullText.includes(context))) {
            score -= 15; // Heavy penalty for non-cybersecurity contexts
        }
        
        // Bonus for articles that mention both the attack type and cybersecurity context
        const cybersecurityContext = ['cybersecurity', 'cyber attack', 'security breach', 'data breach', 'hacking', 'malware', 'vulnerability', 'exploit', 'penetration', 'intrusion'];
        const hasCybersecurityContext = cybersecurityContext.some(term => fullText.includes(term));
        const hasAttackMention = attack.name.toLowerCase().split(' ').some(word => fullText.includes(word));
        
        if (hasAttackMention && hasCybersecurityContext) {
            score += 8; // Increased bonus for proper context
        }
        
        // Additional penalty if article has attack keywords but no cybersecurity context
        if (hasAttackMention && !hasCybersecurityContext) {
            score -= 5; // Penalty for misleading matches
        }
        
        return Math.max(0, score); // Ensure non-negative score
    }

    /**
     * Check if article mentions the specific attack name, aliases, or primary keywords
     */
    private hasExactAttackMatch(text: string, attack: AttackMethodology): boolean {
        const textLower = text.toLowerCase();

        // Helper to check with word boundaries
        const containsPhrase = (haystack: string, needle: string): boolean => {
            // For multi-word phrases, check exact substring
            if (needle.includes(' ')) {
                return haystack.includes(needle);
            }
            // For single words, check with word boundaries
            const regex = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(haystack);
        };

        // Check for attack name
        const attackNameLower = attack.name.toLowerCase();
        if (containsPhrase(textLower, attackNameLower)) {
            return true;
        }

        // Check for aliases
        if (attack.aliases && attack.aliases.length > 0) {
            for (const alias of attack.aliases) {
                if (containsPhrase(textLower, alias.toLowerCase())) {
                    return true;
                }
            }
        }

        // Check for primary search keywords (at least 2 must match)
        const keywordMatches = attack.searchKeywords.slice(0, 4).filter((keyword: string) =>
            containsPhrase(textLower, keyword.toLowerCase())
        ).length;

        // Require at least 2 primary keywords to match
        return keywordMatches >= 2;
    }

    /**
     * Check if article has strong cybersecurity context
     * Must contain cybersecurity-related terms to confirm it's a security article
     */
    private hasStrongCybersecurityContext(text: string): boolean {
        const textLower = text.toLowerCase();

        // Primary cybersecurity indicators (strong signals)
        const primaryTerms = [
            'cybersecurity', 'cyber security', 'cyber attack', 'cyber threat',
            'security breach', 'data breach', 'security incident',
            'hacking', 'hacker', 'hacked',
            'malware', 'ransomware', 'trojan',
            'vulnerability', 'exploit',
            'threat actor', 'security researcher',
            'cybercrime', 'cyberattack'
        ];

        // Secondary security terms (supporting signals)
        const secondaryTerms = [
            'security', 'attack', 'breach', 'threat', 'vulnerability',
            'compromise', 'intrusion', 'penetration',
            'patch', 'zero-day', 'backdoor',
            'phishing', 'credential', 'authentication',
            'encryption', 'firewall', 'antivirus'
        ];

        // Exclude articles that are NOT about cybersecurity
        const excludeContexts = [
            // Legal contexts
            'attorney-client privilege', 'legal privilege', 'court case', 'lawsuit',
            'litigation', 'court ruling', 'legal precedent', 'judge ruled',
            // Medical/health contexts
            'medical', 'healthcare', 'hospital', 'patient privacy', 'hipaa',
            // Physical security contexts
            'border security', 'national security advisor', 'homeland security',
            'social security', 'job security', 'food security',
            // Entertainment/irrelevant contexts
            'celebrity', 'gossip', 'entertainment', 'sports', 'politics', 'weather',
            // Financial contexts (unless explicitly cyber-related)
            'securities and exchange', 'financial security'
        ];

        // Check for exclusion contexts first
        for (const excludeContext of excludeContexts) {
            if (textLower.includes(excludeContext)) {
                // Only reject if it doesn't also have strong cybersecurity terms
                const hasCyberTerm = primaryTerms.some(term => textLower.includes(term));
                if (!hasCyberTerm) {
                    return false;
                }
            }
        }

        // Count primary cybersecurity term matches
        const primaryMatches = primaryTerms.filter(term => textLower.includes(term)).length;

        // If we have at least 1 primary term, it's likely a cybersecurity article
        if (primaryMatches >= 1) {
            return true;
        }

        // Otherwise, require multiple secondary terms to indicate security context
        const secondaryMatches = secondaryTerms.filter(term => textLower.includes(term)).length;

        // Need at least 3 secondary security terms if no primary terms
        return secondaryMatches >= 3;
    }

    /**
     * Check if a keyword appears in cybersecurity context
     */
    private hasCybersecurityContext(text: string, keyword: string): boolean {
        const cybersecurityTerms = [
            'cybersecurity', 'cyber attack', 'security breach', 'data breach', 'hacking', 
            'malware', 'vulnerability', 'exploit', 'penetration', 'intrusion', 'threat',
            'attack', 'compromise', 'incident', 'security', 'cyber', 'hacker'
        ];
        
        // Find the position of the keyword
        const keywordIndex = text.indexOf(keyword);
        if (keywordIndex === -1) return false;
        
        // Check for cybersecurity terms within 100 characters before or after the keyword
        const contextStart = Math.max(0, keywordIndex - 100);
        const contextEnd = Math.min(text.length, keywordIndex + keyword.length + 100);
        const context = text.substring(contextStart, contextEnd);
        
        return cybersecurityTerms.some(term => context.includes(term));
    }
}
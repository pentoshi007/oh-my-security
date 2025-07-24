import type { NewsAPIArticle } from './types.js';
import type { AttackMethodology } from './attackDatabase.js';
export declare class NewsAPIService {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    /**
     * Fetch news articles related to a specific attack methodology
     */
    fetchNewsForAttack(attack: AttackMethodology): Promise<NewsAPIArticle[]>;
    /**
     * Score article relevance to the attack methodology
     */
    private scoreArticleRelevance;
    /**
     * Fetch the latest cybersecurity articles (legacy method)
     */
    fetchCybersecurityNews(): Promise<NewsAPIArticle[]>;
    /**
     * Get yesterday's date in ISO format for NewsAPI
     */
    private getYesterday;
    /**
     * Get date from N days ago in ISO format
     */
    private getDateDaysAgo;
    /**
     * Find the best article based on relevance and recency
     */
    selectBestArticle(articles: NewsAPIArticle[]): NewsAPIArticle;
}
//# sourceMappingURL=newsapi.d.ts.map
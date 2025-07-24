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
        const searchQueries = [
            ...attack.searchKeywords,
            ...attack.aliases,
            attack.name
        ];

        // Try each search query until we find articles
        for (const query of searchQueries) {
            try {
                const articles = await this.searchNews(query);
                if (articles.length > 0) {
                    console.log(`Found ${articles.length} articles for query: "${query}"`);
                    return articles;
                }
            } catch (error) {
                console.warn(`Failed to search for "${query}":`, error);
                continue;
            }
        }

        // If no specific articles found, try general cybersecurity news
        console.log('No specific articles found, trying general cybersecurity news...');
        return await this.fetchCybersecurityNews();
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
            pageSize: '10',
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

        // Filter out articles with null/empty descriptions and sort by relevance
        return data.articles
            .filter(article =>
                article.description &&
                article.description.length > 50 &&
                !article.title.toLowerCase().includes('[removed]')
            )
            .slice(0, 5); // Return top 5 most relevant articles
    }
}
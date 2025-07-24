import axios from 'axios';
export class NewsAPIService {
    constructor(apiKey) {
        this.baseUrl = 'https://newsapi.org/v2';
        this.apiKey = apiKey;
    }
    /**
     * Fetch news articles related to a specific attack methodology
     */
    async fetchNewsForAttack(attack) {
        var _a, _b;
        try {
            // Build search query from attack keywords
            const searchTerms = [
                ...attack.searchKeywords,
                attack.name,
                ...attack.aliases
            ];
            // Create an OR query with all terms
            const query = searchTerms.map(term => `"${term}"`).join(' OR ');
            const response = await axios.get(`${this.baseUrl}/everything`, {
                params: {
                    q: query,
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 20, // Get more articles to find relevant ones
                    from: this.getDateDaysAgo(7), // Look for articles from last 7 days
                },
                headers: {
                    'X-API-Key': this.apiKey,
                },
            });
            if (response.data.status !== 'ok') {
                throw new Error(`NewsAPI error: ${response.data.status}`);
            }
            // Filter and score articles for relevance
            const scoredArticles = response.data.articles
                .filter(article => article.title &&
                article.description &&
                article.url &&
                !article.title.includes('[Removed]') &&
                !article.description.includes('[Removed]'))
                .map(article => {
                const score = this.scoreArticleRelevance(article, attack);
                return { article, score };
            })
                .filter(item => item.score > 0) // Only keep relevant articles
                .sort((a, b) => b.score - a.score); // Sort by relevance
            return scoredArticles.map(item => item.article);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch news: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Score article relevance to the attack methodology
     */
    scoreArticleRelevance(article, attack) {
        let score = 0;
        const titleLower = article.title.toLowerCase();
        const descLower = (article.description || '').toLowerCase();
        const contentLower = (article.content || '').toLowerCase();
        // Check for exact attack name or aliases
        if (titleLower.includes(attack.name.toLowerCase()))
            score += 5;
        if (descLower.includes(attack.name.toLowerCase()))
            score += 3;
        attack.aliases.forEach(alias => {
            if (titleLower.includes(alias.toLowerCase()))
                score += 4;
            if (descLower.includes(alias.toLowerCase()))
                score += 2;
        });
        // Check for search keywords
        attack.searchKeywords.forEach(keyword => {
            if (titleLower.includes(keyword.toLowerCase()))
                score += 3;
            if (descLower.includes(keyword.toLowerCase()))
                score += 2;
            if (contentLower.includes(keyword.toLowerCase()))
                score += 1;
        });
        // Boost score for recent articles
        const articleDate = new Date(article.publishedAt);
        const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSincePublished < 1)
            score += 3;
        else if (daysSincePublished < 3)
            score += 2;
        else if (daysSincePublished < 7)
            score += 1;
        // Boost for reputable sources
        const reputableSources = ['reuters', 'bbc', 'cnn', 'techcrunch', 'wired', 'ars technica', 'zdnet', 'bleeping computer', 'the hacker news'];
        if (reputableSources.some(source => article.source.name.toLowerCase().includes(source))) {
            score += 2;
        }
        return score;
    }
    /**
     * Fetch the latest cybersecurity articles (legacy method)
     */
    async fetchCybersecurityNews() {
        var _a, _b;
        try {
            const response = await axios.get(`${this.baseUrl}/everything`, {
                params: {
                    q: 'cybersecurity OR "cyber attack" OR "data breach" OR hacking OR malware OR ransomware OR phishing',
                    language: 'en',
                    sortBy: 'publishedAt',
                    pageSize: 10,
                    from: this.getYesterday(), // Get recent articles
                },
                headers: {
                    'X-API-Key': this.apiKey,
                },
            });
            if (response.data.status !== 'ok') {
                throw new Error(`NewsAPI error: ${response.data.status}`);
            }
            // Filter out articles without proper content
            return response.data.articles.filter(article => article.title &&
                article.description &&
                article.url &&
                !article.title.includes('[Removed]') &&
                !article.description.includes('[Removed]'));
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch news: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
            }
            throw error;
        }
    }
    /**
     * Get yesterday's date in ISO format for NewsAPI
     */
    getYesterday() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    }
    /**
     * Get date from N days ago in ISO format
     */
    getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }
    /**
     * Find the best article based on relevance and recency
     */
    selectBestArticle(articles) {
        if (articles.length === 0) {
            throw new Error('No articles available');
        }
        // Score articles based on title keywords and description quality
        const scoredArticles = articles.map(article => {
            let score = 0;
            const titleLower = article.title.toLowerCase();
            const descLower = (article.description || '').toLowerCase();
            // High-value cybersecurity keywords
            const highValueKeywords = [
                'breach', 'hack', 'attack', 'vulnerability', 'exploit',
                'malware', 'ransomware', 'phishing', 'zero-day'
            ];
            // Award points for high-value keywords
            highValueKeywords.forEach(keyword => {
                if (titleLower.includes(keyword))
                    score += 3;
                if (descLower.includes(keyword))
                    score += 1;
            });
            // Prefer articles with detailed descriptions
            if (article.description && article.description.length > 100) {
                score += 2;
            }
            // Prefer articles from reputable sources
            const reputableSources = ['reuters', 'bbc', 'cnn', 'techcrunch', 'wired', 'ars technica'];
            if (reputableSources.some(source => article.source.name.toLowerCase().includes(source))) {
                score += 1;
            }
            return { article, score };
        });
        // Sort by score and return the best article
        scoredArticles.sort((a, b) => b.score - a.score);
        return scoredArticles[0].article;
    }
}
//# sourceMappingURL=newsapi.js.map
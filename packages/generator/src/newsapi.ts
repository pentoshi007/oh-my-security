import axios from 'axios';
import type { NewsAPIResponse, NewsAPIArticle } from './types.js';

export class NewsAPIService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch the latest cybersecurity articles
   */
  async fetchCybersecurityNews(): Promise<NewsAPIArticle[]> {
    try {
      const response = await axios.get<NewsAPIResponse>(`${this.baseUrl}/everything`, {
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
      return response.data.articles.filter(article => 
        article.title && 
        article.description && 
        article.url &&
        !article.title.includes('[Removed]') &&
        !article.description.includes('[Removed]')
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch news: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get yesterday's date in ISO format for NewsAPI
   */
  private getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  /**
   * Find the best article based on relevance and recency
   */
  selectBestArticle(articles: NewsAPIArticle[]): NewsAPIArticle {
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
        if (titleLower.includes(keyword)) score += 3;
        if (descLower.includes(keyword)) score += 1;
      });

      // Prefer articles with detailed descriptions
      if (article.description && article.description.length > 100) {
        score += 2;
      }

      // Prefer articles from reputable sources
      const reputableSources = ['reuters', 'bbc', 'cnn', 'techcrunch', 'wired', 'ars technica'];
      if (reputableSources.some(source => 
        article.source.name.toLowerCase().includes(source)
      )) {
        score += 1;
      }

      return { article, score };
    });

    // Sort by score and return the best article
    scoredArticles.sort((a, b) => b.score - a.score);
    return scoredArticles[0].article;
  }
} 
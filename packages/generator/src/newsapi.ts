import axios from 'axios';
import type { NewsAPIResponse, NewsAPIArticle } from './types.js';
import type { AttackMethodology } from './attackDatabase.js';

export class NewsAPIService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch news articles related to a specific attack methodology
   */
  async fetchNewsForAttack(attack: AttackMethodology): Promise<NewsAPIArticle[]> {
    try {
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
          const response = await axios.get<NewsAPIResponse>(`${this.baseUrl}/everything`, {
            params: {
              q: query,
              language: 'en',
              sortBy: 'publishedAt',
              pageSize: 15, // Get more articles per strategy
              from: this.getDateDaysAgo(14), // Look for articles from last 14 days
            },
            headers: {
              'X-API-Key': this.apiKey,
            },
          });

          if (response.data.status === 'ok') {
            // Add unique articles
            response.data.articles.forEach(article => {
              if (article.url && !seenUrls.has(article.url) && 
                  article.title && article.description &&
                  !article.title.includes('[Removed]') &&
                  !article.description.includes('[Removed]')) {
                allArticles.push(article);
                seenUrls.add(article.url);
              }
            });
          }
        } catch (strategyError) {
          console.log(`Search strategy failed: ${query}`, strategyError);
          continue;
        }

        // If we have enough relevant articles, stop trying more strategies
        if (allArticles.length >= 10) {
          break;
        }
      }

      // Score and filter articles for relevance
      const scoredArticles = allArticles
        .map(article => {
          const score = this.scoreArticleRelevance(article, attack);
          return { article, score };
        })
        .filter(item => item.score > 2) // Higher threshold for relevance
        .sort((a, b) => b.score - a.score); // Sort by relevance

      // Return top 5 most relevant articles
      return scoredArticles.slice(0, 5).map(item => item.article);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch news: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Score article relevance to the attack methodology
   */
  private scoreArticleRelevance(article: NewsAPIArticle, attack: AttackMethodology): number {
    let score = 0;
    const titleLower = article.title.toLowerCase();
    const descLower = (article.description || '').toLowerCase();
    const contentLower = (article.content || '').toLowerCase();
    const fullText = `${titleLower} ${descLower} ${contentLower}`;
    
    // High-value exact matches (attack name in title gets highest score)
    if (titleLower.includes(attack.name.toLowerCase())) score += 10;
    if (descLower.includes(attack.name.toLowerCase())) score += 6;
    if (contentLower.includes(attack.name.toLowerCase())) score += 4;
    
    // Check for aliases with high weight
    attack.aliases.forEach(alias => {
      if (titleLower.includes(alias.toLowerCase())) score += 8;
      if (descLower.includes(alias.toLowerCase())) score += 4;
      if (contentLower.includes(alias.toLowerCase())) score += 2;
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
      if (contentLower.includes(keywordLower)) {
        score += hasCybersecurityContext ? Math.floor(weight / 2) : Math.floor(weight / 4); // Much reduced without context
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
    
    // Boost score for recent articles
    const articleDate = new Date(article.publishedAt);
    const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 1) score += 4;
    else if (daysSincePublished < 3) score += 3;
    else if (daysSincePublished < 7) score += 2;
    else if (daysSincePublished < 14) score += 1;
    
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

  /**
   * Fetch the latest cybersecurity articles (legacy method)
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
   * Get date from N days ago in ISO format
   */
  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
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
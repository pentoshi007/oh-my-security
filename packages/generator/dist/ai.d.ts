import type { BlueTeamContent, RedTeamContent } from './types.js';
import type { AttackMethodology } from './attackDatabase.js';
import type { NewsAPIArticle } from './types.js';
export declare class AIContentGenerator {
    private genAI;
    private model;
    constructor(apiKey: string);
    generateBlueTeamContent(attack: AttackMethodology, newsArticles: NewsAPIArticle[]): Promise<BlueTeamContent>;
    generateRedTeamContent(attack: AttackMethodology, newsArticles: NewsAPIArticle[]): Promise<RedTeamContent>;
    /**
     * Create a news context summary from articles
     */
    private createNewsContext;
    private generateContent;
    private parseBlueTeamContent;
    private parseRedTeamContent;
    private getFallbackBlueTeamContent;
    private getFallbackRedTeamContent;
}
//# sourceMappingURL=ai.d.ts.map
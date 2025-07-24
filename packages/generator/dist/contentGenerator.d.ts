import type { Ora } from 'ora';
export declare function generateDailyContent(spinner: Ora): Promise<{
    date: string;
    attackType: string;
    article: {
        title: string;
        url: string;
        source: string;
        publishedAt: string;
        summary: string;
    };
    content: {
        blueTeam: {
            about: string;
            howItWorks: string;
            impact: string;
        };
        redTeam: {
            objectives: string;
            methodology: string;
            exploitCode?: string | undefined;
        };
    };
    metadata: {
        generatedAt: string;
        version: string;
        attackId?: string | undefined;
        category?: string | undefined;
        newsArticlesUsed?: number | undefined;
    };
}>;
//# sourceMappingURL=contentGenerator.d.ts.map
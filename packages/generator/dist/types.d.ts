import { z } from 'zod';
export declare const AttackTypes: readonly ["SQL Injection", "Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)", "Buffer Overflow", "Phishing", "Malware", "Ransomware", "DDoS Attack", "Man-in-the-Middle", "Social Engineering", "Privilege Escalation", "Remote Code Execution", "Data Breach", "Zero-Day Exploit", "Brute Force Attack", "DNS Poisoning", "ARP Spoofing", "Session Hijacking", "Directory Traversal", "Command Injection", "XML External Entity (XXE)", "Server-Side Request Forgery (SSRF)", "Insecure Deserialization", "Security Misconfiguration", "Broken Authentication"];
export type AttackType = typeof AttackTypes[number];
export declare const BlueTeamContentSchema: z.ZodObject<{
    about: z.ZodString;
    howItWorks: z.ZodString;
    impact: z.ZodString;
}, "strip", z.ZodTypeAny, {
    about: string;
    howItWorks: string;
    impact: string;
}, {
    about: string;
    howItWorks: string;
    impact: string;
}>;
export declare const RedTeamContentSchema: z.ZodObject<{
    objectives: z.ZodString;
    methodology: z.ZodString;
    exploitCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    objectives: string;
    methodology: string;
    exploitCode?: string | undefined;
}, {
    objectives: string;
    methodology: string;
    exploitCode?: string | undefined;
}>;
export declare const DailyContentSchema: z.ZodObject<{
    date: z.ZodString;
    attackType: z.ZodString;
    article: z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        source: z.ZodString;
        publishedAt: z.ZodString;
        summary: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        title: string;
        url: string;
        source: string;
        publishedAt: string;
        summary: string;
    }, {
        title: string;
        url: string;
        source: string;
        publishedAt: string;
        summary: string;
    }>;
    content: z.ZodObject<{
        blueTeam: z.ZodObject<{
            about: z.ZodString;
            howItWorks: z.ZodString;
            impact: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            about: string;
            howItWorks: string;
            impact: string;
        }, {
            about: string;
            howItWorks: string;
            impact: string;
        }>;
        redTeam: z.ZodObject<{
            objectives: z.ZodString;
            methodology: z.ZodString;
            exploitCode: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            objectives: string;
            methodology: string;
            exploitCode?: string | undefined;
        }, {
            objectives: string;
            methodology: string;
            exploitCode?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
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
    }, {
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
    }>;
    metadata: z.ZodObject<{
        generatedAt: z.ZodString;
        version: z.ZodDefault<z.ZodString>;
        attackId: z.ZodOptional<z.ZodString>;
        category: z.ZodOptional<z.ZodString>;
        newsArticlesUsed: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        generatedAt: string;
        version: string;
        attackId?: string | undefined;
        category?: string | undefined;
        newsArticlesUsed?: number | undefined;
    }, {
        generatedAt: string;
        version?: string | undefined;
        attackId?: string | undefined;
        category?: string | undefined;
        newsArticlesUsed?: number | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
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
}, {
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
        version?: string | undefined;
        attackId?: string | undefined;
        category?: string | undefined;
        newsArticlesUsed?: number | undefined;
    };
}>;
export type DailyContent = z.infer<typeof DailyContentSchema>;
export type BlueTeamContent = z.infer<typeof BlueTeamContentSchema>;
export type RedTeamContent = z.infer<typeof RedTeamContentSchema>;
export interface NewsAPIResponse {
    status: string;
    totalResults: number;
    articles: NewsAPIArticle[];
}
export interface NewsAPIArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}
//# sourceMappingURL=types.d.ts.map
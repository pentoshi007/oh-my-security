import { z } from 'zod';
// Attack types that we can detect and categorize
export const AttackTypes = [
    'SQL Injection',
    'Cross-Site Scripting (XSS)',
    'Cross-Site Request Forgery (CSRF)',
    'Buffer Overflow',
    'Phishing',
    'Malware',
    'Ransomware',
    'DDoS Attack',
    'Man-in-the-Middle',
    'Social Engineering',
    'Privilege Escalation',
    'Remote Code Execution',
    'Data Breach',
    'Zero-Day Exploit',
    'Brute Force Attack',
    'DNS Poisoning',
    'ARP Spoofing',
    'Session Hijacking',
    'Directory Traversal',
    'Command Injection',
    'XML External Entity (XXE)',
    'Server-Side Request Forgery (SSRF)',
    'Insecure Deserialization',
    'Security Misconfiguration',
    'Broken Authentication'
];
// Blue Team (Defensive) Content Schema
export const BlueTeamContentSchema = z.object({
    about: z.string().describe('Introduction to this attack type'),
    howItWorks: z.string().describe('Technical explanation of how the attack works'),
    impact: z.string().describe('Potential damage and consequences of this attack'),
});
// Red Team (Offensive) Content Schema  
export const RedTeamContentSchema = z.object({
    objectives: z.string().describe('What attackers can achieve with this method'),
    methodology: z.string().describe('Step-by-step attack execution process'),
    exploitCode: z.string().optional().describe('Example exploit code or commands (if applicable)'),
});
// Main content schema for each day
export const DailyContentSchema = z.object({
    date: z.string().describe('Date in YYYY-MM-DD format'),
    attackType: z.string().describe('The main attack type covered'), // Changed from enum to string for flexibility
    article: z.object({
        title: z.string().describe('Original news article title'),
        url: z.string().url().describe('Link to the source article'),
        source: z.string().describe('News source name'),
        publishedAt: z.string().describe('Article publication date'),
        summary: z.string().describe('Brief summary of the article in 2-3 sentences'),
    }),
    content: z.object({
        blueTeam: BlueTeamContentSchema,
        redTeam: RedTeamContentSchema,
    }),
    metadata: z.object({
        generatedAt: z.string().describe('Timestamp when content was generated'),
        version: z.string().default('1.0.0'),
        attackId: z.string().optional().describe('Unique ID of the attack methodology'),
        category: z.string().optional().describe('Attack category'),
        newsArticlesUsed: z.number().optional().describe('Number of news articles used for generation'),
    }),
});
//# sourceMappingURL=types.js.map
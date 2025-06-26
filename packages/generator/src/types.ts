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
] as const;

export type AttackType = typeof AttackTypes[number];

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
  attackType: z.enum(AttackTypes).describe('The main attack type covered'),
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
  }),
});

export type DailyContent = z.infer<typeof DailyContentSchema>;
export type BlueTeamContent = z.infer<typeof BlueTeamContentSchema>;
export type RedTeamContent = z.infer<typeof RedTeamContentSchema>;

// NewsAPI Response Types
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
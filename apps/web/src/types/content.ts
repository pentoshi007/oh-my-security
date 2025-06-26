export interface BlueTeamContent {
  about: string;
  howItWorks: string;
  impact: string;
}

export interface RedTeamContent {
  objectives: string;
  methodology: string;
  exploitCode?: string;
}

export interface Article {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  summary: string;
}

export interface ContentMetadata {
  generatedAt: string;
  version: string;
}

export interface DailyContent {
  date: string;
  attackType: string;
  article: Article;
  content: {
    blueTeam: BlueTeamContent;
    redTeam: RedTeamContent;
  };
  metadata: ContentMetadata;
}

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
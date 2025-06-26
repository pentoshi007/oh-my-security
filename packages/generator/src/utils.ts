import { AttackTypes, type AttackType } from './types.js';

/**
 * Get date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  const customDate = process.env.CUSTOM_DATE;
  if (customDate) {
    return customDate;
  }
  return new Date().toISOString().split('T')[0];
}

/**
 * Detect attack type from article title and description using keyword matching
 */
export function detectAttackType(title: string, description: string = ''): AttackType {
  const text = `${title} ${description}`.toLowerCase();
  
  // Keyword mappings for attack detection
  const attackKeywords: Record<AttackType, string[]> = {
    'SQL Injection': ['sql injection', 'sqli', 'sql attack', 'database injection'],
    'Cross-Site Scripting (XSS)': ['xss', 'cross-site scripting', 'script injection'],
    'Cross-Site Request Forgery (CSRF)': ['csrf', 'cross-site request forgery', 'request forgery'],
    'Buffer Overflow': ['buffer overflow', 'stack overflow', 'heap overflow'],
    'Phishing': ['phishing', 'phish', 'fake email', 'email scam'],
    'Malware': ['malware', 'virus', 'trojan', 'worm', 'spyware'],
    'Ransomware': ['ransomware', 'ransom', 'encrypted files', 'lockbit', 'conti'],
    'DDoS Attack': ['ddos', 'dos attack', 'distributed denial', 'denial of service'],
    'Man-in-the-Middle': ['man-in-the-middle', 'mitm', 'intercepted', 'eavesdropping'],
    'Social Engineering': ['social engineering', 'social attack', 'human manipulation'],
    'Privilege Escalation': ['privilege escalation', 'privilege', 'escalation', 'admin access'],
    'Remote Code Execution': ['remote code execution', 'rce', 'code execution'],
    'Data Breach': ['data breach', 'data leak', 'stolen data', 'data theft'],
    'Zero-Day Exploit': ['zero-day', 'zero day', '0-day', 'unknown vulnerability'],
    'Brute Force Attack': ['brute force', 'password attack', 'credential stuffing'],
    'DNS Poisoning': ['dns poisoning', 'dns spoofing', 'dns attack'],
    'ARP Spoofing': ['arp spoofing', 'arp poisoning', 'arp attack'],
    'Session Hijacking': ['session hijacking', 'session theft', 'stolen session'],
    'Directory Traversal': ['directory traversal', 'path traversal', '../'],
    'Command Injection': ['command injection', 'command execution', 'shell injection'],
    'XML External Entity (XXE)': ['xxe', 'xml external entity', 'xml injection'],
    'Server-Side Request Forgery (SSRF)': ['ssrf', 'server-side request forgery'],
    'Insecure Deserialization': ['deserialization', 'serialization attack'],
    'Security Misconfiguration': ['misconfiguration', 'misconfig', 'configuration error'],
    'Broken Authentication': ['broken authentication', 'auth bypass', 'authentication bypass'],
  };

  // Find the attack type with the most keyword matches
  let bestMatch: AttackType = 'Data Breach'; // Default fallback
  let maxMatches = 0;

  for (const [attackType, keywords] of Object.entries(attackKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = attackType as AttackType;
    }
  }

  return bestMatch;
}

/**
 * Clean and validate file path
 */
export function getContentFilePath(date: string): string {
  return `../../content/${date}.json`;
}

/**
 * Format date for display
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 
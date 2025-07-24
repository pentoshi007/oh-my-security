import { NextRequest } from 'next/server'
import { storeContentInSupabase } from '../../../lib/supabase'

// Force dynamic rendering for cron jobs
export const dynamic = 'force-dynamic'

// Comprehensive attack methodologies database (matching original)
const ATTACK_METHODOLOGIES = [
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    category: 'Web Application Attacks',
    description: 'Code injection technique that exploits vulnerabilities in database queries',
    searchKeywords: ['sql injection', 'sqli', 'database attack', 'code injection'],
    difficulty: 'Medium',
    impacts: ['Data breach', 'Data manipulation', 'Service disruption', 'Authentication bypass']
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    category: 'Malware',
    description: 'Malicious software that encrypts files and demands payment for decryption',
    searchKeywords: ['ransomware', 'ransom', 'encryption attack', 'crypto-malware'],
    difficulty: 'High',
    impacts: ['Business disruption', 'Financial loss', 'Data loss', 'Operational shutdown']
  },
  {
    id: 'phishing',
    name: 'Phishing',
    category: 'Social Engineering',
    description: 'Fraudulent attempt to obtain sensitive information by disguising as trustworthy entity',
    searchKeywords: ['phishing', 'email scam', 'fake website', 'credential harvesting'],
    difficulty: 'Low',
    impacts: ['Credential theft', 'Identity theft', 'Financial fraud', 'Account takeover']
  },
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    category: 'Web Application Attacks',
    description: 'Injection of malicious scripts into trusted websites viewed by other users',
    searchKeywords: ['xss', 'cross-site scripting', 'script injection', 'web vulnerability'],
    difficulty: 'Medium',
    impacts: ['Session hijacking', 'Data theft', 'Malware distribution', 'Website defacement']
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle Attack',
    category: 'Network Attacks',
    description: 'Eavesdropping attack where communication between two parties is secretly intercepted',
    searchKeywords: ['man-in-the-middle', 'mitm', 'eavesdropping', 'network interception'],
    difficulty: 'Medium',
    impacts: ['Data interception', 'Communication compromise', 'Privacy violation', 'Credential theft']
  },
  {
    id: 'ddos',
    name: 'Distributed Denial of Service',
    category: 'Network Attacks',
    description: 'Attempt to disrupt normal traffic by overwhelming target with flood of internet traffic',
    searchKeywords: ['ddos', 'denial of service', 'traffic flood', 'botnet attack'],
    difficulty: 'High',
    impacts: ['Service unavailability', 'Revenue loss', 'Reputation damage', 'Infrastructure strain']
  },
  {
    id: 'zero-day',
    name: 'Zero-Day Exploit',
    category: 'Advanced Attacks',
    description: 'Cyber attack that exploits unknown or unpatched security vulnerabilities',
    searchKeywords: ['zero-day', 'zero day', 'unknown vulnerability', 'unpatched exploit'],
    difficulty: 'High',
    impacts: ['System compromise', 'Data breach', 'Persistent access', 'Advanced persistent threat']
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering',
    category: 'Human Factor',
    description: 'Psychological manipulation to trick people into divulging confidential information',
    searchKeywords: ['social engineering', 'human manipulation', 'psychological attack', 'pretexting'],
    difficulty: 'Medium',
    impacts: ['Information disclosure', 'Unauthorized access', 'Trust violation', 'Security bypass']
  },
  {
    id: 'malware',
    name: 'Malware',
    category: 'Malware',
    description: 'Malicious software designed to damage, disrupt, or gain unauthorized access',
    searchKeywords: ['malware', 'virus', 'trojan', 'malicious software'],
    difficulty: 'Medium',
    impacts: ['System infection', 'Data theft', 'System damage', 'Backdoor access']
  },
  {
    id: 'csrf',
    name: 'Cross-Site Request Forgery (CSRF)',
    category: 'Web Application Attacks',
    description: 'Attack that forces authenticated users to submit unintended requests',
    searchKeywords: ['csrf', 'cross-site request forgery', 'session riding', 'web attack'],
    difficulty: 'Medium',
    impacts: ['Unauthorized actions', 'Data modification', 'Account compromise', 'State change attacks']
  },
  {
    id: 'buffer-overflow',
    name: 'Buffer Overflow',
    category: 'Memory Corruption',
    description: 'Programming error that allows data to overflow into adjacent memory locations',
    searchKeywords: ['buffer overflow', 'memory corruption', 'stack overflow', 'heap overflow'],
    difficulty: 'High',
    impacts: ['Code execution', 'System crash', 'Privilege escalation', 'Memory corruption']
  },
  {
    id: 'privilege-escalation',
    name: 'Privilege Escalation',
    category: 'System Attacks',
    description: 'Act of exploiting vulnerabilities to gain elevated access to protected resources',
    searchKeywords: ['privilege escalation', 'elevation of privilege', 'admin access', 'root access'],
    difficulty: 'High',
    impacts: ['Administrative access', 'System control', 'Data access', 'Security bypass']
  },
  {
    id: 'brute-force',
    name: 'Brute Force Attack',
    category: 'Authentication Attacks',
    description: 'Trial-and-error method to decode encrypted data or gain access by trying many passwords',
    searchKeywords: ['brute force', 'password attack', 'credential stuffing', 'dictionary attack'],
    difficulty: 'Low',
    impacts: ['Account compromise', 'Unauthorized access', 'Password cracking', 'System breach']
  },
  {
    id: 'dns-poisoning',
    name: 'DNS Poisoning',
    category: 'Network Attacks',
    description: 'Corruption of DNS resolver cache to redirect domain names to malicious IP addresses',
    searchKeywords: ['dns poisoning', 'dns spoofing', 'cache poisoning', 'domain hijacking'],
    difficulty: 'High',
    impacts: ['Traffic redirection', 'Phishing attacks', 'Man-in-the-middle', 'Service disruption']
  },
  {
    id: 'session-hijacking',
    name: 'Session Hijacking',
    category: 'Web Application Attacks',
    description: 'Exploitation of valid computer session to gain unauthorized access',
    searchKeywords: ['session hijacking', 'session fixation', 'cookie theft', 'session attack'],
    difficulty: 'Medium',
    impacts: ['Account takeover', 'Unauthorized access', 'Identity theft', 'Data breach']
  },
  {
    id: 'directory-traversal',
    name: 'Directory Traversal',
    category: 'Web Application Attacks',
    description: 'Attack that allows access to files and directories outside the web root folder',
    searchKeywords: ['directory traversal', 'path traversal', 'dot dot slash', 'file inclusion'],
    difficulty: 'Medium',
    impacts: ['File access', 'Information disclosure', 'System compromise', 'Configuration exposure']
  },
  {
    id: 'command-injection',
    name: 'Command Injection',
    category: 'Web Application Attacks',
    description: 'Execution of arbitrary commands on host operating system via vulnerable application',
    searchKeywords: ['command injection', 'os command injection', 'shell injection', 'code execution'],
    difficulty: 'High',
    impacts: ['System compromise', 'Remote code execution', 'Data breach', 'Server takeover']
  },
  {
    id: 'xxe',
    name: 'XML External Entity (XXE)',
    category: 'Web Application Attacks',
    description: 'Attack against applications that parse XML input with external entity references',
    searchKeywords: ['xxe', 'xml external entity', 'xml injection', 'xml parser attack'],
    difficulty: 'Medium',
    impacts: ['File disclosure', 'Server-side request forgery', 'Denial of service', 'Remote code execution']
  },
  {
    id: 'ssrf',
    name: 'Server-Side Request Forgery (SSRF)',
    category: 'Web Application Attacks',
    description: 'Attack that allows attacker to induce server-side application to make HTTP requests',
    searchKeywords: ['ssrf', 'server-side request forgery', 'internal network access', 'port scanning'],
    difficulty: 'Medium',
    impacts: ['Internal network access', 'Data exfiltration', 'Service enumeration', 'Cloud metadata access']
  },
  {
    id: 'deserialization',
    name: 'Insecure Deserialization',
    category: 'Application Attacks',
    description: 'Flawed deserialization leading to remote code execution and other attacks',
    searchKeywords: ['insecure deserialization', 'object injection', 'serialization attack', 'pickle attack'],
    difficulty: 'High',
    impacts: ['Remote code execution', 'Authentication bypass', 'Privilege escalation', 'Denial of service']
  },
  {
    id: 'arp-spoofing',
    name: 'ARP Spoofing',
    category: 'Network Attacks',
    description: 'Technique where attacker sends falsified ARP messages over local area network',
    searchKeywords: ['arp spoofing', 'arp poisoning', 'mac address spoofing', 'network attack'],
    difficulty: 'Medium',
    impacts: ['Network traffic interception', 'Man-in-the-middle attacks', 'Data theft', 'Network disruption']
  },
  {
    id: 'rce',
    name: 'Remote Code Execution',
    category: 'System Attacks',
    description: 'Ability for attacker to execute arbitrary code on target machine or process',
    searchKeywords: ['remote code execution', 'rce', 'arbitrary code execution', 'code injection'],
    difficulty: 'High',
    impacts: ['System compromise', 'Data breach', 'Malware installation', 'Complete system control']
  },
  {
    id: 'data-breach',
    name: 'Data Breach',
    category: 'Data Security',
    description: 'Incident where sensitive, protected, or confidential data is accessed without authorization',
    searchKeywords: ['data breach', 'data leak', 'information disclosure', 'privacy violation'],
    difficulty: 'Medium',
    impacts: ['Privacy violation', 'Financial loss', 'Regulatory penalties', 'Reputation damage']
  },
  {
    id: 'broken-auth',
    name: 'Broken Authentication',
    category: 'Authentication Attacks',
    description: 'Application functions related to authentication and session management are implemented incorrectly',
    searchKeywords: ['broken authentication', 'weak authentication', 'session management', 'auth bypass'],
    difficulty: 'Medium',
    impacts: ['Account takeover', 'Identity theft', 'Unauthorized access', 'Privilege escalation']
  },
  {
    id: 'security-misconfig',
    name: 'Security Misconfiguration',
    category: 'Configuration Attacks',
    description: 'Incomplete or ad hoc configurations, open cloud storage, misconfigured HTTP headers',
    searchKeywords: ['security misconfiguration', 'misconfig', 'default credentials', 'exposed services'],
    difficulty: 'Low',
    impacts: ['Unauthorized access', 'Information disclosure', 'System compromise', 'Data exposure']
  }
];

// Simple history tracker for serverless environment
let usedAttackIds: string[] = [];

// Enhanced mock Ora instance for serverless environment
const createMockSpinner = (operation: string) => ({
  start: (text?: string) => {
    console.log(`🚀 [${operation}] ${text || 'Starting...'}`);
    return mockSpinner;
  },
  succeed: (text?: string) => {
    console.log(`✅ [${operation}] ${text || 'Completed successfully'}`);
    return mockSpinner;
  },
  fail: (text?: string) => {
    console.log(`❌ [${operation}] ${text || 'Failed'}`);
    return mockSpinner;
  },
  warn: (text?: string) => {
    console.log(`⚠️ [${operation}] ${text || 'Warning'}`);
    return mockSpinner;
  },
  info: (text?: string) => {
    console.log(`ℹ️ [${operation}] ${text || 'Info'}`);
    return mockSpinner;
  },
});

const mockSpinner = createMockSpinner('CRON');

// NewsAPI service
class NewsAPIService {
  constructor(private apiKey: string) { }

  async fetchCybersecurityNews() {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=cybersecurity OR "cyber attack" OR hacking OR "data breach"&sortBy=publishedAt&pageSize=20&apiKey=${this.apiKey}`
    );
    const data = await response.json();
    return data.articles || [];
  }

  async fetchNewsForAttack(attack: any) {
    const keywords = attack.searchKeywords.join(' OR ');
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&sortBy=publishedAt&pageSize=10&apiKey=${this.apiKey}`
    );
    const data = await response.json();
    return data.articles || [];
  }
}

// AI Content Generator using Google Gemini (matching original comprehensive approach)
class AIContentGenerator {
  constructor(private apiKey: string) { }

  async generateBlueTeamContent(attack: any, newsArticles: any[]) {
    const newsContext = this.createNewsContext(newsArticles);

    const prompt = `You are a senior cybersecurity analyst writing educational content for 'Oh-My-Security'.
Your task is to generate a detailed, structured, and professional analysis for the attack type: "${attack.name}".

Attack Description: ${attack.description}
Attack Category: ${attack.category}
Known Impacts: ${attack.impacts.join(', ')}

Recent Real-World Examples from News:
${newsContext}

IMPORTANT:
- Your response must begin DIRECTLY with "ABOUT SECTION:". Do not add any preamble.
- Follow the specified format exactly. Do not add extra markdown like asterisks to the section titles.
- Reference the real-world examples from the news articles provided when relevant.

Format:

ABOUT SECTION:
[Detailed explanation of what the attack is, its importance, threat landscape, and economic impact. Reference recent incidents from the news articles. Minimum 200 words.]

HOW IT WORKS SECTION:
Provide a detailed technical breakdown of how the attack works, including phases like initial access, persistence, lateral movement, objective execution, and cleanup. Use numbered lists or clear paragraphs. When possible, reference how the attacks in the news articles were conducted.

IMPACT SECTION:
Provide a detailed impact analysis, covering financial, operational, and strategic/reputational consequences. Include specific examples from the news articles about real-world impacts.`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Blue Team Success (Google Gemini)');
      return this.parseBlueTeamContent(content, attack.name);
    } catch (error) {
      console.log('❌ AI Blue Team Error (Google Gemini):', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackBlueTeamContent(attack.name);
    }
  }

  async generateRedTeamContent(attack: any, newsArticles: any[]) {
    const newsContext = this.createNewsContext(newsArticles);

    const prompt = `You are a senior red team operator writing educational content for 'Oh-My-Security'.
Your task is to generate a detailed, structured, and professional analysis of offensive techniques for the attack type: "${attack.name}".

Attack Description: ${attack.description}
Attack Category: ${attack.category}
Attack Difficulty: ${attack.difficulty}

Recent Real-World Examples from News:
${newsContext}

IMPORTANT:
- Your response must begin DIRECTLY with "OBJECTIVES SECTION:". Do not add any preamble.
- Follow the specified format exactly. Do not add extra markdown like asterisks to the section titles.
- For the EXPLOIT CODE SECTION, provide functional, commented, educational code examples.
- Reference the real-world attack methods from the news when relevant.

Format:

OBJECTIVES SECTION:
[Detailed explanation of strategic goals. Reference what attackers achieved in the real-world examples. Minimum 200 words.]

METHODOLOGY SECTION:
[Provide a detailed, multi-phase attack methodology from reconnaissance to cleanup, focusing on offensive techniques. Include insights from how the attacks in the news were conducted.]

EXPLOIT CODE SECTION:
[Provide educational, functional code examples for demonstrating the attack, with comments. For example:
# ${attack.name} Educational Simulation Framework
# WARNING: For authorized educational and testing purposes only
...
]`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Red Team Success (Google Gemini)');
      return this.parseRedTeamContent(content, attack.name);
    } catch (error) {
      console.log('❌ AI Red Team Error (Google Gemini):', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackRedTeamContent(attack.name);
    }
  }

  private createNewsContext(articles: any[]): string {
    if (articles.length === 0) {
      return 'No recent news articles found for this attack type.';
    }

    const topArticles = articles.slice(0, 3);

    return topArticles.map((article, index) => {
      const date = new Date(article.publishedAt).toLocaleDateString();
      return `${index + 1}. "${article.title}" - ${article.source.name} (${date})
   Summary: ${article.description}`;
    }).join('\n\n');
  }

  private async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + this.apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!generatedText) {
        throw new Error('AI generation failed: No response text from Gemini.');
      }

      return generatedText;
    } catch (error) {
      throw new Error(`Google Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private parseBlueTeamContent(content: string, attackType: string) {
    const extractSection = (text: string, startMarker: string, endMarkers: string[]): string => {
      const startIndex = text.toLowerCase().indexOf(startMarker.toLowerCase());
      if (startIndex === -1) return '';
      let endIndex = text.length;
      for (const marker of endMarkers) {
        const markerIndex = text.toLowerCase().indexOf(marker.toLowerCase(), startIndex + startMarker.length);
        if (markerIndex !== -1 && markerIndex < endIndex) {
          endIndex = markerIndex;
        }
      }
      return text.substring(startIndex + startMarker.length, endIndex).trim();
    };

    const cleanAndFormat = (text: string): string => {
      if (!text) return '';
      return text.replace(/^\s*[-*•]\s*/gm, '• ').replace(/^\s*(\d+)\.\s*/gm, '$1. ').replace(/\n\s*\n\s*\n/g, '\n\n').replace(/^\s+/gm, '').trim();
    };

    const aboutSection = extractSection(content, 'ABOUT SECTION:', ['HOW IT WORKS SECTION:']);
    const howItWorksSection = extractSection(content, 'HOW IT WORKS SECTION:', ['IMPACT SECTION:']);
    const impactSection = extractSection(content, 'IMPACT SECTION:', []);

    return {
      about: cleanAndFormat(aboutSection) || this.getFallbackBlueTeamContent(attackType).about,
      howItWorks: cleanAndFormat(howItWorksSection) || this.getFallbackBlueTeamContent(attackType).howItWorks,
      impact: cleanAndFormat(impactSection) || this.getFallbackBlueTeamContent(attackType).impact,
    };
  }

  private parseRedTeamContent(content: string, attackType: string) {
    const extractSection = (text: string, startMarker: string, endMarkers: string[]): string => {
      const startIndex = text.toLowerCase().indexOf(startMarker.toLowerCase());
      if (startIndex === -1) return '';
      let endIndex = text.length;
      for (const marker of endMarkers) {
        const markerIndex = text.toLowerCase().indexOf(marker.toLowerCase(), startIndex + startMarker.length);
        if (markerIndex !== -1 && markerIndex < endIndex) {
          endIndex = markerIndex;
        }
      }
      return text.substring(startIndex + startMarker.length, endIndex).trim();
    };

    const cleanAndFormat = (text: string): string => {
      if (!text) return '';
      return text.replace(/^\s*[-*•]\s*/gm, '• ').replace(/^\s*(\d+)\.\s*/gm, '$1. ').replace(/\n\s*\n\s*\n/g, '\n\n').replace(/^\s+/gm, '').trim();
    };

    const objectivesSection = extractSection(content, 'OBJECTIVES SECTION:', ['METHODOLOGY SECTION:']);
    const methodologySection = extractSection(content, 'METHODOLOGY SECTION:', ['EXPLOIT CODE SECTION:']);
    const exploitSection = extractSection(content, 'EXPLOIT CODE SECTION:', []);

    return {
      objectives: cleanAndFormat(objectivesSection) || this.getFallbackRedTeamContent(attackType).objectives,
      methodology: cleanAndFormat(methodologySection) || this.getFallbackRedTeamContent(attackType).methodology,
      exploitCode: cleanAndFormat(exploitSection) || this.getFallbackRedTeamContent(attackType).exploitCode,
    };
  }

  private getFallbackBlueTeamContent(attackType: string) {
    const fallbacks: Record<string, any> = {
      'Ransomware': {
        about: `Ransomware is malicious software that encrypts files, demanding a ransom for decryption. It's a major threat, with organized groups using advanced techniques to target all sectors, causing significant financial and operational damage.`,
        howItWorks: `Attacks often begin with phishing or exploiting vulnerabilities. Once inside, attackers escalate privileges, move laterally to find critical assets, exfiltrate sensitive data for double extortion, and then deploy the ransomware to encrypt files and systems.`,
        impact: `The impact includes direct ransom costs, business downtime, recovery expenses, regulatory fines, and long-term reputational damage. Critical infrastructure is a prime target, where attacks can disrupt essential services.`
      },
      'SQL Injection': {
        about: `SQL Injection is a code injection technique that exploits vulnerabilities in database queries. It remains one of the most critical web application security risks, allowing attackers to manipulate database queries and potentially gain unauthorized access to sensitive data.`,
        howItWorks: `Attackers insert malicious SQL code into application input fields, exploiting insufficient input validation. This can lead to unauthorized data access, modification, or deletion. The attack typically involves identifying vulnerable parameters, crafting malicious payloads, and executing them through web forms or URL parameters.`,
        impact: `SQL injection can result in complete database compromise, unauthorized data access, data manipulation or deletion, authentication bypass, and potential system takeover. The financial and reputational damage can be severe, especially when sensitive customer data is involved.`
      },
      'Phishing': {
        about: `Phishing is a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity in electronic communications. It represents one of the most common and effective attack vectors, exploiting human psychology rather than technical vulnerabilities.`,
        howItWorks: `Attackers create convincing fake emails, websites, or messages that appear to come from legitimate sources. They use social engineering techniques to trick users into revealing credentials, personal information, or installing malware. Modern phishing campaigns often use sophisticated techniques like domain spoofing and targeted spear-phishing.`,
        impact: `Phishing attacks can lead to credential theft, identity theft, financial fraud, malware installation, and unauthorized access to corporate systems. The human element makes this attack particularly dangerous and difficult to defend against purely through technical means.`
      }
    };

    return fallbacks[attackType] || {
      about: `${attackType} represents a significant cybersecurity threat that organizations must understand and actively defend against through comprehensive security programs.`,
      howItWorks: `${attackType} attacks typically exploit vulnerabilities in systems, applications, or human behavior to gain unauthorized access, steal data, or disrupt operations.`,
      impact: `${attackType} incidents can result in substantial financial losses, regulatory penalties, operational disruption, data compromise, and long-term reputational damage.`,
    };
  }

  private getFallbackRedTeamContent(attackType: string) {
    const fallbacks: Record<string, any> = {
      'Ransomware': {
        objectives: `The primary objective is financial extortion through ransom payments. This is often coupled with double extortion, where attackers also steal sensitive data and threaten to leak it to increase pressure on the victim.`,
        methodology: `Attackers gain initial access via phishing or exploiting vulnerabilities. They then conduct reconnaissance, escalate privileges, move laterally across the network to find critical systems and backups, exfiltrate data, and finally deploy the ransomware.`,
        exploitCode: `# EDUCATIONAL RANSOMWARE SIMULATION\n# WARNING: For authorized educational and testing purposes only\n\n# This framework demonstrates ransomware techniques for security training\n# Used only in controlled environments with proper authorization\n\n# Key phases:\n# 1. Initial Access (phishing, RDP brute force, vulnerability exploitation)\n# 2. Reconnaissance and Discovery\n# 3. Privilege Escalation\n# 4. Lateral Movement\n# 5. Data Exfiltration\n# 6. Encryption Deployment\n\n# Detection indicators:\n# - Unusual file encryption activity\n# - Suspicious network traffic patterns\n# - Unauthorized privilege escalation attempts`
      },
      'SQL Injection': {
        objectives: `The primary objectives include unauthorized data access, database manipulation, authentication bypass, and potentially gaining administrative control over the underlying system. Attackers may seek to extract sensitive information, modify data, or use the database as a pivot point for further attacks.`,
        methodology: `The attack methodology involves: 1) Target reconnaissance to identify potential injection points, 2) Input validation testing to find vulnerable parameters, 3) Payload crafting and injection to exploit the vulnerability, 4) Data extraction or manipulation based on objectives, 5) Privilege escalation if possible, and 6) Maintaining persistence or covering tracks.`,
        exploitCode: `# EDUCATIONAL SQL INJECTION SIMULATION\n# WARNING: For authorized educational and testing purposes only\n\n# Basic SQL injection examples for security training:\n\n# Authentication bypass:\n# Username: admin' --\n# Password: anything\n\n# Union-based data extraction:\n# ' UNION SELECT username, password FROM users --\n\n# Boolean-based blind injection:\n# ' AND 1=1 -- (true condition)\n# ' AND 1=2 -- (false condition)\n\n# Time-based blind injection:\n# '; WAITFOR DELAY '00:00:05' --\n\n# Prevention measures:\n# - Use parameterized queries/prepared statements\n# - Input validation and sanitization\n# - Principle of least privilege for database accounts\n# - Regular security testing and code reviews`
      },
      'Phishing': {
        objectives: `The primary objectives include credential harvesting, malware delivery, financial fraud, identity theft, and gaining initial access to corporate networks. Attackers may also seek to establish persistence, conduct business email compromise (BEC), or use phishing as a stepping stone for more sophisticated attacks.`,
        methodology: `The attack methodology involves: 1) Target research and reconnaissance to gather information about victims, 2) Infrastructure setup including fake domains and hosting, 3) Content creation with convincing emails and landing pages, 4) Campaign deployment through email or other channels, 5) Victim interaction and data collection, and 6) Follow-up exploitation of harvested credentials or installed malware.`,
        exploitCode: `# EDUCATIONAL PHISHING SIMULATION FRAMEWORK\n# WARNING: For authorized educational and testing purposes only\n\n# This framework is for security awareness training and authorized penetration testing\n\n# Common phishing techniques:\n# 1. Email spoofing and domain impersonation\n# 2. Social engineering and psychological manipulation\n# 3. Credential harvesting through fake login pages\n# 4. Malicious attachments and links\n# 5. Business Email Compromise (BEC) tactics\n\n# Example phishing indicators:\n# - Suspicious sender addresses\n# - Urgent or threatening language\n# - Unexpected attachments or links\n# - Requests for sensitive information\n# - Poor grammar or spelling\n\n# Defense strategies:\n# - Security awareness training\n# - Email filtering and authentication (SPF, DKIM, DMARC)\n# - Multi-factor authentication\n# - Regular phishing simulations\n# - Incident response procedures`
      }
    };

    return fallbacks[attackType] || {
      objectives: `The objectives of a ${attackType} attack are varied, but often include financial gain, data theft, or operational disruption.`,
      methodology: `The methodology of a ${attackType} attack involves several phases, starting with reconnaissance and ending with the attacker achieving their objective.`,
      exploitCode: `# EDUCATIONAL ${attackType.toUpperCase()} SIMULATION\n# WARNING: For authorized educational and testing purposes only\n\n# This framework demonstrates ${attackType} techniques for security training\n# Used only in controlled environments with proper authorization\n\n# Key phases and indicators would be documented here\n# along with detection and prevention strategies`,
    };
  }
}

// Real content generation function
async function generateDailyContent() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY || process.env.HF_TOKEN;

  if (!newsApiKey || !googleApiKey) {
    throw new Error('Missing required API keys: NEWS_API_KEY and (GOOGLE_API_KEY or HF_TOKEN) must be set');
  }

  const newsService = new NewsAPIService(newsApiKey);
  const aiService = new AIContentGenerator(googleApiKey);

  // Select next attack methodology (avoid recently used ones)
  const availableAttacks = ATTACK_METHODOLOGIES.filter(
    attack => !usedAttackIds.includes(attack.id)
  );

  let selectedAttack;
  if (availableAttacks.length === 0) {
    // Reset if all attacks have been used
    usedAttackIds = [];
    selectedAttack = ATTACK_METHODOLOGIES[Math.floor(Math.random() * ATTACK_METHODOLOGIES.length)];
  } else {
    selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
  }

  mockSpinner.succeed(`Selected: ${selectedAttack.name}`);
  console.log(`📚 Category: ${selectedAttack.category}`);
  console.log(`🎯 Difficulty: ${selectedAttack.difficulty}`);

  // Search for relevant news
  mockSpinner.start(`Searching for news about ${selectedAttack.name}...`);
  let articles = await newsService.fetchNewsForAttack(selectedAttack);

  if (articles.length === 0) {
    mockSpinner.warn(`No specific news found, using general cybersecurity news`);
    const generalArticles = await newsService.fetchCybersecurityNews();
    articles = generalArticles.slice(0, 3);
  }

  mockSpinner.succeed(`Found ${articles.length} relevant articles`);

  if (articles.length > 0) {
    console.log(`📰 Top article: "${articles[0].title}" - ${articles[0].source.name}`);
  }

  // Generate comprehensive content using AI (matching original approach)
  mockSpinner.start('Generating comprehensive educational content with AI...');
  const [blueTeamContent, redTeamContent] = await Promise.all([
    aiService.generateBlueTeamContent(selectedAttack, articles),
    aiService.generateRedTeamContent(selectedAttack, articles),
  ]);
  mockSpinner.succeed('Comprehensive AI content generation completed');

  const currentDate = new Date().toISOString().split('T')[0];

  // Create the comprehensive content structure (matching original format)
  const content = {
    date: currentDate,
    attackType: selectedAttack.name,
    article: articles.length > 0 ? {
      title: articles[0].title,
      url: articles[0].url,
      source: articles[0].source.name,
      publishedAt: articles[0].publishedAt,
      summary: articles[0].description || articles[0].title,
    } : {
      title: `Educational Content: ${selectedAttack.name}`,
      url: 'https://oh-my-security.vercel.app',
      source: 'Oh-My-Security',
      publishedAt: new Date().toISOString(),
      summary: selectedAttack.description,
    },
    content: {
      blueTeam: blueTeamContent,
      redTeam: redTeamContent,
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      attackId: selectedAttack.id,
      category: selectedAttack.category,
      newsArticlesUsed: articles.length,
      difficulty: selectedAttack.difficulty,
      impact: selectedAttack.impacts.join(', ')
    }
  };

  // Update history
  usedAttackIds.push(selectedAttack.id);
  if (usedAttackIds.length > 10) {
    usedAttackIds = usedAttackIds.slice(-10); // Keep last 10
  }

  console.log(`📊 Attack methodologies available: ${ATTACK_METHODOLOGIES.length}`);

  return content;
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('🚀 Cron job started at:', new Date().toISOString());
    console.log('📍 User-Agent:', request.headers.get('user-agent'));
    console.log('📍 Authorization header present:', !!request.headers.get('authorization'));

    // Verify cron secret for security (only if CRON_SECRET is set)
    if (process.env.CRON_SECRET) {
      const authHeader = request.headers.get('authorization');
      const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

      if (authHeader !== expectedAuth) {
        console.log('❌ Unauthorized cron attempt - auth header mismatch');
        console.log('Expected:', expectedAuth.substring(0, 20) + '...');
        console.log('Received:', authHeader?.substring(0, 20) + '...');
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      console.log('⚠️ CRON_SECRET not set - skipping authorization check');
    }

    // Check required environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'NEWS_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    // Check for AI API key (either Google or HuggingFace)
    if (!process.env.GOOGLE_API_KEY && !process.env.HF_TOKEN) {
      missingVars.push('GOOGLE_API_KEY or HF_TOKEN');
    }

    if (missingVars.length > 0) {
      const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
      console.error('❌', errorMsg);
      return Response.json({
        success: false,
        error: errorMsg,
        missingVariables: missingVars
      }, { status: 500 });
    }

    console.log('🚀 Starting daily content generation with real AI-powered generator...');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);

    // Generate real content using the sophisticated generator
    mockSpinner.start('Generating daily cybersecurity content...');
    const content = await generateDailyContent();
    mockSpinner.succeed(`Generated content for ${content.date}: ${content.attackType}`);

    // Store in Supabase
    mockSpinner.start('Storing content in Supabase...');
    await storeContentInSupabase(content);
    mockSpinner.succeed('Content stored successfully in database');

    // Filesystem backup (only in development or when content directory exists)
    if (process.env.NODE_ENV === 'development') {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');

        const contentDir = path.join(process.cwd(), 'content');
        await fs.mkdir(contentDir, { recursive: true });

        const filePath = path.join(contentDir, `${content.date}.json`);
        await fs.writeFile(filePath, JSON.stringify(content, null, 2));

        mockSpinner.succeed('Backup saved to filesystem');
      } catch (backupError) {
        mockSpinner.warn('Development filesystem backup failed');
        console.error('Backup error:', backupError);
      }
    } else {
      console.log('📦 Skipping filesystem backup in production (Supabase is primary storage)');
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Cron job completed successfully in ${duration}ms`);

    return Response.json({
      success: true,
      message: 'Daily content generated and stored in Supabase',
      date: content.date,
      attackType: content.attackType,
      category: content.metadata.category,
      difficulty: content.metadata.difficulty,
      articlesUsed: content.metadata.newsArticlesUsed,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      storage: 'Supabase (Primary)',
      environment: process.env.NODE_ENV || 'production'
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    console.error('❌ Cron job failed after', duration, 'ms:', error);
    mockSpinner.fail('Content generation failed');

    return Response.json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 
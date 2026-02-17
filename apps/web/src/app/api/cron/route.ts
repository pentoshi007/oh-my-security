import { NextRequest } from 'next/server'
import { storeContentInSupabase, supabaseAdmin } from '../../../lib/supabase'
import { revalidatePath, revalidateTag } from 'next/cache'

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
    aliases: ['SQLi', 'Database Injection'],
    difficulty: 'Medium',
    impacts: ['Data breach', 'Data manipulation', 'Service disruption', 'Authentication bypass']
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    category: 'Malware',
    description: 'Malicious software that encrypts files and demands payment for decryption',
    searchKeywords: ['ransomware', 'ransom', 'encryption attack', 'crypto-malware'],
    aliases: ['Crypto-malware', 'Cryptolocker'],
    difficulty: 'High',
    impacts: ['Business disruption', 'Financial loss', 'Data loss', 'Operational shutdown']
  },
  {
    id: 'phishing',
    name: 'Phishing',
    category: 'Social Engineering',
    description: 'Fraudulent attempt to obtain sensitive information by disguising as trustworthy entity',
    searchKeywords: ['phishing', 'email scam', 'fake website', 'credential harvesting'],
    aliases: ['Spear Phishing', 'Whaling'],
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
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Attack',
    category: 'Advanced Attacks',
    description: 'Attack targeting less-secure elements in supply chain to compromise final target',
    searchKeywords: ['supply chain attack', 'solarwinds', 'log4shell', 'software supply chain', 'dependency attack'],
    aliases: ['Third-Party Attack', 'Dependency Compromise'],
    difficulty: 'High',
    impacts: ['Widespread compromise', 'Trust violation', 'Massive data breach', 'System backdoor']
  },
  {
    id: 'api-security',
    name: 'API Security Vulnerabilities',
    category: 'Web Application Attacks',
    description: 'Exploitation of weaknesses in API authentication, authorization, or implementation',
    searchKeywords: ['api security', 'api vulnerability', 'api attack', 'rest api exploit', 'api injection'],
    aliases: ['API Exploitation', 'REST API Attack'],
    difficulty: 'Medium',
    impacts: ['Data exposure', 'Unauthorized access', 'Business logic bypass', 'Data manipulation']
  },
  {
    id: 'credential-stuffing',
    name: 'Credential Stuffing',
    category: 'Authentication Attacks',
    description: 'Automated injection of breached username/password pairs to gain unauthorized access',
    searchKeywords: ['credential stuffing', 'password spraying', 'account takeover', 'credential reuse'],
    aliases: ['Password Spraying', 'Account Takeover'],
    difficulty: 'Medium',
    impacts: ['Account compromise', 'Identity theft', 'Fraud', 'Data breach']
  },
  {
    id: 'business-email-compromise',
    name: 'Business Email Compromise (BEC)',
    category: 'Social Engineering',
    description: 'Sophisticated scam targeting businesses by compromising legitimate email accounts',
    searchKeywords: ['business email compromise', 'bec', 'ceo fraud', 'email fraud', 'wire fraud'],
    aliases: ['CEO Fraud', 'Email Account Compromise'],
    difficulty: 'Medium',
    impacts: ['Financial loss', 'Wire fraud', 'Data theft', 'Reputation damage']
  },
  {
    id: 'cryptojacking',
    name: 'Cryptojacking',
    category: 'Malware',
    description: 'Unauthorized use of computing resources to mine cryptocurrency',
    searchKeywords: ['cryptojacking', 'crypto mining malware', 'cryptocurrency hijacking', 'illegal mining'],
    aliases: ['Cryptocurrency Mining Malware', 'Drive-by Mining'],
    difficulty: 'Medium',
    impacts: ['Resource exhaustion', 'Performance degradation', 'Increased costs', 'System damage']
  },
  {
    id: 'iot-attacks',
    name: 'IoT Device Attacks',
    category: 'Network Attacks',
    description: 'Exploitation of vulnerabilities in Internet of Things devices and networks',
    searchKeywords: ['iot attack', 'smart device hack', 'iot vulnerability', 'iot botnet', 'mirai'],
    aliases: ['Smart Device Attack', 'IoT Botnet'],
    difficulty: 'Medium',
    impacts: ['Device compromise', 'Network access', 'Privacy violation', 'Botnet recruitment']
  },
  {
    id: 'cloud-misconfig',
    name: 'Cloud Misconfiguration',
    category: 'Configuration Attacks',
    description: 'Improperly configured cloud services leading to data exposure and security breaches',
    searchKeywords: ['cloud misconfiguration', 's3 bucket leak', 'azure misconfig', 'cloud security', 'exposed database'],
    aliases: ['S3 Bucket Misconfiguration', 'Cloud Storage Leak'],
    difficulty: 'Low',
    impacts: ['Data exposure', 'Privacy breach', 'Compliance violation', 'Reputation damage']
  },
  {
    id: 'watering-hole',
    name: 'Watering Hole Attack',
    category: 'Advanced Attacks',
    description: 'Targeted attack compromising websites frequently visited by intended victims',
    searchKeywords: ['watering hole', 'strategic web compromise', 'targeted website attack', 'drive-by download'],
    aliases: ['Strategic Web Compromise', 'Targeted Website Attack'],
    difficulty: 'High',
    impacts: ['Targeted infection', 'Malware distribution', 'Credential theft', 'Data exfiltration']
  },
  {
    id: 'typosquatting',
    name: 'Typosquatting',
    category: 'Social Engineering',
    description: 'Registration of domain names similar to legitimate ones to deceive users',
    searchKeywords: ['typosquatting', 'domain spoofing', 'url hijacking', 'fake domain', 'homograph attack'],
    aliases: ['URL Hijacking', 'Domain Spoofing'],
    difficulty: 'Low',
    impacts: ['Phishing', 'Malware distribution', 'Brand reputation damage', 'Credential theft']
  },
  {
    id: 'fileless-malware',
    name: 'Fileless Malware',
    category: 'Malware',
    description: 'Malware that operates in memory without writing files to disk, evading detection',
    searchKeywords: ['fileless malware', 'living off the land', 'memory-only malware', 'powershell attack'],
    aliases: ['Memory-Only Malware', 'Living Off The Land'],
    difficulty: 'High',
    impacts: ['Evasion of detection', 'Persistence', 'Data theft', 'System compromise']
  },
  {
    id: 'ai-poisoning',
    name: 'AI Model Poisoning',
    category: 'Advanced Attacks',
    description: 'Manipulation of AI training data or models to influence behavior and outcomes',
    searchKeywords: ['ai poisoning', 'model poisoning', 'adversarial machine learning', 'data poisoning', 'ml attack'],
    aliases: ['Data Poisoning', 'Model Manipulation'],
    difficulty: 'High',
    impacts: ['Model corruption', 'Biased predictions', 'Security bypass', 'Data integrity loss']
  },
  {
    id: 'smishing',
    name: 'SMS Phishing (Smishing)',
    category: 'Social Engineering',
    description: 'Phishing attack conducted through SMS text messages to steal sensitive information',
    searchKeywords: ['smishing', 'sms phishing', 'text message scam', 'mobile phishing'],
    aliases: ['Text Message Phishing', 'SMS Scam'],
    difficulty: 'Low',
    impacts: ['Credential theft', 'Financial fraud', 'Malware installation', 'Identity theft']
  },
  {
    id: 'container-escape',
    name: 'Container Escape',
    category: 'System Attacks',
    description: 'Breaking out of container isolation to access host system or other containers',
    searchKeywords: ['container escape', 'docker escape', 'kubernetes attack', 'container breakout'],
    aliases: ['Docker Escape', 'Container Breakout'],
    difficulty: 'High',
    impacts: ['Host compromise', 'Privilege escalation', 'Data access', 'Lateral movement']
  },
  {
    id: 'deepfake',
    name: 'Deepfake Attacks',
    category: 'Social Engineering',
    description: 'Use of AI-generated synthetic media to impersonate individuals for fraud or manipulation',
    searchKeywords: ['deepfake', 'synthetic media', 'ai impersonation', 'voice cloning', 'video manipulation'],
    aliases: ['Synthetic Media Attack', 'AI Impersonation'],
    difficulty: 'Medium',
    impacts: ['Identity fraud', 'Reputation damage', 'Financial fraud', 'Misinformation']
  },
  {
    id: 'juice-jacking',
    name: 'Juice Jacking',
    category: 'Physical Attacks',
    description: 'Cyber attack through compromised USB charging stations to steal data or install malware',
    searchKeywords: ['juice jacking', 'usb charging attack', 'public charging', 'usb attack'],
    aliases: ['USB Charging Attack', 'Charging Port Attack'],
    difficulty: 'Low',
    impacts: ['Data theft', 'Malware installation', 'Device compromise', 'Privacy violation']
  }
];

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

// AI-powered news search helper — uses a fast, free model to generate smart search queries
// and select the most relevant articles for the daily attack topic
const SEARCH_AI_MODEL = 'arcee-ai/trinity-mini:free';

async function callSearchAI(openrouterApiKey: string, systemPrompt: string, userPrompt: string): Promise<string | null> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://oh-my-security.vercel.app',
        'X-Title': 'Oh-My-Security News Search'
      },
      body: JSON.stringify({
        model: SEARCH_AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 4096,
      })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error body');
      console.log(`⚠️ Search AI returned ${response.status}: ${response.statusText} — ${errorBody}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.log('⚠️ Search AI returned empty content');
      return null;
    }
    return content;
  } catch (error) {
    console.log('⚠️ Search AI call failed:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

// Extract JSON from AI response — handles markdown code fences and raw JSON
function extractJSON(text: string): any | null {
  try {
    // Try raw parse first
    return JSON.parse(text);
  } catch {
    // Try extracting from code fence
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      try { return JSON.parse(fenceMatch[1].trim()); } catch { /* fall through */ }
    }
    // Try finding JSON object/array in the text
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[1]); } catch { /* fall through */ }
    }
    return null;
  }
}

// News service using NewsAPI.org with AI-powered search term generation and article selection
class NewsAPIService {
  constructor(private apiKey: string, private openrouterApiKey: string) { }

  async fetchCybersecurityNews() {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=cybersecurity OR "cyber attack" OR hacking OR "data breach"&language=en&sortBy=publishedAt&pageSize=10&apiKey=${this.apiKey}`
    );
    const data = await response.json();

    if (data.status === 'ok' && data.articles) {
      return data.articles
        .filter((article: any) => article.title && article.title !== '[Removed]')
        .map((article: any) => ({
          url: article.url || '#',
          title: article.title || 'Untitled',
          description: article.description || 'No description available',
          content: article.content || '',
          publishedAt: article.publishedAt || new Date().toISOString(),
          source: {
            name: article.source?.name || 'Unknown Source'
          }
        }));
    }

    return [];
  }

  /**
   * Step 1: Ask AI to generate smart search queries for NewsAPI based on the attack topic.
   * The AI understands how journalists write about these topics and generates queries
   * that match real-world article language — not just technical jargon.
   */
  private async generateSearchQueries(attack: any): Promise<string[]> {
    console.log('🤖 Asking AI to generate search queries...');

    const systemPrompt = `Generate 4 NewsAPI search queries for a cybersecurity attack topic. Use NewsAPI syntax: "exact phrases", AND/OR operators. Output ONLY JSON: {"queries": ["q1","q2","q3","q4"]}`;

    const userPrompt = `Attack: ${attack.name} (${attack.category})
Keywords: ${attack.searchKeywords.join(', ')}${attack.aliases ? ` | Aliases: ${attack.aliases.join(', ')}` : ''}

Generate 4 varied queries using terms journalists would use in headlines about "${attack.name}". Output ONLY the JSON.`;

    const aiResponse = await callSearchAI(this.openrouterApiKey, systemPrompt, userPrompt);

    if (aiResponse) {
      const parsed = extractJSON(aiResponse);
      if (parsed?.queries && Array.isArray(parsed.queries) && parsed.queries.length > 0) {
        const queries = parsed.queries.filter((q: any) => typeof q === 'string' && q.trim().length > 0).slice(0, 5);
        if (queries.length > 0) {
          console.log(`✅ AI generated ${queries.length} search queries`);
          queries.forEach((q: string, i: number) => console.log(`  Query ${i + 1}: ${q.substring(0, 100)}${q.length > 100 ? '...' : ''}`));
          return queries;
        }
      }
      console.log('⚠️ AI response did not contain valid queries, using fallback');
    }

    // Fallback: hardcoded strategies if AI fails
    return this.getFallbackQueries(attack);
  }

  /**
   * Fallback search queries when AI is unavailable
   */
  private getFallbackQueries(attack: any): string[] {
    console.log('📋 Using fallback search queries');
    return [
      `"${attack.name}" AND (cybersecurity OR "cyber attack" OR hacking OR security)`,
      `(${attack.searchKeywords.slice(0, 3).map((k: string) => `"${k}"`).join(' OR ')}) AND (cybersecurity OR security OR hacking)`,
      `${attack.name} AND ${attack.category.toLowerCase()} AND (cyber OR security OR attack)`,
    ];
  }

  /**
   * Step 2: Fetch articles from NewsAPI using the AI-generated (or fallback) queries
   */
  private async fetchArticlesFromAPI(queries: string[]): Promise<any[]> {
    let allArticles: any[] = [];
    const seenUrls = new Set<string>();
    const fromDate = this.getDateDaysAgo(29);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      try {
        console.log(`  Fetching query ${i + 1}/${queries.length}: ${query.substring(0, 80)}...`);

        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevancy&pageSize=20&from=${fromDate}&apiKey=${this.apiKey}`
        );
        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
          console.log(`  → ${data.articles.length} results`);
          data.articles.forEach((article: any) => {
            if (article.url && !seenUrls.has(article.url) &&
                article.title && article.description &&
                article.title !== '[Removed]' &&
                article.description !== '[Removed]') {
              allArticles.push({
                url: article.url,
                title: article.title,
                description: article.description,
                content: article.content || '',
                publishedAt: article.publishedAt,
                source: { name: article.source?.name || 'Unknown' }
              });
              seenUrls.add(article.url);
            }
          });
        } else {
          console.log(`  → Query ${i + 1} error: ${data.status} ${data.message || ''}`);
        }
      } catch (err) {
        console.log(`  → Query ${i + 1} failed:`, err instanceof Error ? err.message : err);
      }

      // Stop early if we have plenty of candidates
      if (allArticles.length >= 30) break;

      // Small delay between API calls
      if (i < queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    return allArticles;
  }

  /**
   * Step 3: Ask AI to select the most relevant articles from the candidates.
   * The AI reads each article's title + description and picks the ones that
   * genuinely match the attack topic — understanding context, not just keywords.
   */
  private async selectRelevantArticles(attack: any, candidates: any[]): Promise<any[]> {
    if (candidates.length === 0) return [];

    // If very few candidates, skip AI selection — they're all we have
    if (candidates.length <= 3) {
      console.log(`📰 Only ${candidates.length} candidates — skipping AI selection`);
      return candidates;
    }

    console.log(`🤖 Asking AI to select best articles from ${candidates.length} candidates...`);

    // Build a compact article list for the AI to evaluate
    const articleList = candidates.slice(0, 30).map((a, i) =>
      `[${i}] "${a.title}" — ${a.source.name} (${new Date(a.publishedAt).toLocaleDateString()})\n    ${(a.description || '').substring(0, 200)}`
    ).join('\n\n');

    const systemPrompt = `You are a cybersecurity news curator. Your job is to select the most relevant news articles for a specific cyber attack topic.

SELECTION CRITERIA (in order of importance):
1. RELEVANCE: Article must be specifically about the attack type, not just mentioning security in passing
2. SPECIFICITY: Prefer articles about real incidents, campaigns, or vulnerabilities over generic advice
3. RECENCY: Prefer newer articles over older ones
4. QUALITY: Prefer reputable cybersecurity sources (The Hacker News, BleepingComputer, Dark Reading, etc.)
5. DIVERSITY: Pick articles covering different aspects (incident reports, technical analysis, defense guides)

REJECT articles that:
- Are about a different type of attack entirely
- Only mention the attack type in passing while being about something else
- Are about non-cyber topics (legal, medical, border security, social security, etc.)
- Are duplicate coverage of the same incident

Respond with ONLY a JSON object:
{"selected": [0, 3, 7], "reasoning": "brief explanation of why these were chosen"}

Select 3-5 of the BEST articles. If fewer than 3 are genuinely relevant, select only those.
If NONE are relevant, respond: {"selected": [], "reasoning": "none match"}`;

    const userPrompt = `Select the most relevant articles about "${attack.name}" (${attack.category}).

Attack description: ${attack.description}

CANDIDATE ARTICLES:
${articleList}`;

    const aiResponse = await callSearchAI(this.openrouterApiKey, systemPrompt, userPrompt);

    if (aiResponse) {
      const parsed = extractJSON(aiResponse);
      if (parsed?.selected && Array.isArray(parsed.selected)) {
        const validIndices = parsed.selected
          .filter((idx: any) => typeof idx === 'number' && idx >= 0 && idx < candidates.length);

        if (validIndices.length > 0) {
          const selected = validIndices.slice(0, 5).map((idx: number) => candidates[idx]);
          console.log(`✅ AI selected ${selected.length} relevant articles${parsed.reasoning ? `: ${parsed.reasoning.substring(0, 100)}` : ''}`);
          selected.forEach((a: any) => console.log(`  ✓ "${a.title.substring(0, 80)}..." — ${a.source.name}`));
          return selected;
        }

        if (parsed.selected.length === 0) {
          console.log(`⚠️ AI found no relevant articles: ${parsed.reasoning || 'no reason given'}`);
          return [];
        }
      }
      console.log('⚠️ AI selection response was malformed, using basic fallback ranking');
    }

    // Fallback: basic keyword-based selection if AI fails
    return this.fallbackArticleSelection(attack, candidates);
  }

  /**
   * Fallback selection when AI is unavailable — simple keyword matching
   */
  private fallbackArticleSelection(attack: any, candidates: any[]): any[] {
    console.log('📋 Using fallback keyword selection');
    const attackNameLower = attack.name.toLowerCase();
    const keywordsLower = attack.searchKeywords.map((k: string) => k.toLowerCase());

    const scored = candidates.map(article => {
      const text = `${article.title} ${article.description}`.toLowerCase();
      let score = 0;
      if (text.includes(attackNameLower)) score += 50;
      keywordsLower.forEach((kw: string) => { if (text.includes(kw)) score += 10; });
      // Boost recent articles
      const days = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (days < 7) score += 15;
      else if (days < 14) score += 10;
      return { article, score };
    });

    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.article);
  }

  /**
   * Main method: AI-driven news search pipeline
   * 1. AI generates search queries → 2. Fetch from NewsAPI → 3. AI selects best articles
   */
  async fetchNewsForAttack(attack: any) {
    try {
      console.log(`🔍 AI-powered news search for: ${attack.name}`);

      // Step 1: Generate search queries (AI or fallback)
      const queries = await this.generateSearchQueries(attack);

      // Step 2: Fetch candidate articles from NewsAPI
      console.log('📡 Fetching articles from NewsAPI...');
      const candidates = await this.fetchArticlesFromAPI(queries);
      console.log(`📊 Total unique candidate articles: ${candidates.length}`);

      if (candidates.length === 0) {
        console.log(`⚠️ No articles found for ${attack.name}`);
        return [];
      }

      // Step 3: AI selects the most relevant articles (or fallback)
      const selectedArticles = await this.selectRelevantArticles(attack, candidates);

      if (selectedArticles.length === 0) {
        console.log(`⚠️ No relevant articles selected for ${attack.name}`);
      } else {
        console.log(`✅ Final: ${selectedArticles.length} relevant articles for ${attack.name}`);
      }

      return selectedArticles;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}

const CONTENT_MODELS = [
  'openai/gpt-oss-120b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen3-coder:free',
];

const CODE_MODELS = [
  'qwen/qwen3-coder:free',
  'openai/gpt-oss-120b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
];

class AIContentGenerator {
  constructor(private apiKey: string) { }

  async generateBlueTeamContent(attack: any, newsArticles: any[]) {
    const newsContext = this.createNewsContext(newsArticles);

    const prompt = `You are a senior cybersecurity analyst writing in-depth educational content for "Oh-My-Security", a daily cybersecurity education platform.

Generate a comprehensive, well-structured defensive (Blue Team) analysis for the attack type: "${attack.name}".

Attack Description: ${attack.description}
Attack Category: ${attack.category}
Known Impacts: ${attack.impacts.join(', ')}

Recent Real-World Examples from News:
${newsContext}

CRITICAL FORMATTING RULES — follow these exactly:
1. Your response MUST begin with "ABOUT SECTION:" on its own line. No preamble, no greetings.
2. Use the exact section markers: "ABOUT SECTION:", "HOW IT WORKS SECTION:", "IMPACT SECTION:" — each on its own line.
3. Do NOT add markdown formatting (like ** or ##) to the section marker lines themselves.
4. WITHIN each section, use proper markdown formatting:
   - Use ### for sub-headings within a section (e.g., "### Threat Landscape", "### Economic Impact")
   - Use **bold** for key terms, attack names, and important concepts
   - Use bullet points (- ) for listing items, indicators, or short facts
   - Use numbered lists (1. 2. 3.) for sequential steps or phases
   - Separate paragraphs with a blank line between them
   - Keep paragraphs focused — one idea per paragraph, 3-5 sentences each
5. Do NOT place headings in the middle of a paragraph. Always put a blank line before and after any ### heading.
6. Reference real-world examples from the provided news articles where relevant, citing the source name.

LANGUAGE & ACCESSIBILITY RULES — equally important:
7. Write in simple, conversational English. Imagine explaining this to a smart friend who has zero cybersecurity background.
8. Every technical term MUST be explained on first use. Put a plain-English explanation in parentheses right after the term, e.g. "lateral movement (when attackers move from one compromised computer to other systems on the same network)".
9. Use real-world analogies to make abstract concepts tangible, e.g. "Think of a firewall like a security guard at a building entrance — it checks who's allowed in and who isn't."
10. Avoid jargon-heavy sentences. If a sentence has more than 2 technical terms, break it into shorter sentences and explain each term.
11. Use "you" and "your" to make it feel personal and relevant, e.g. "If your organization uses cloud storage, this attack could target you."
12. After explaining a technical concept, add a one-line "In simple terms:" or "Think of it this way:" summary where helpful.

ABOUT SECTION:
Write a detailed, beginner-friendly explanation covering:
- What the attack is in plain language — explain it like someone has never heard of it
- Why it matters in today's threat landscape and why ordinary people should care
- Historical context and evolution of this attack type — tell the story
- Current prevalence and recent trends with real numbers where possible
- Economic and organizational impact with statistics
- Reference specific incidents from the news articles provided
Minimum 350 words. Use sub-headings to organize the content. Make every paragraph accessible to a beginner.

HOW IT WORKS SECTION:
Write a detailed but easy-to-follow technical breakdown covering:
- What conditions need to exist for this attack to work (explain prerequisites simply)
- Step-by-step attack phases explained like a story (use numbered lists): reconnaissance, initial access, execution, persistence, lateral movement, objective completion, cleanup/covering tracks — explain each phase name in plain English
- Technical mechanisms and protocols exploited — name the technology, then explain what it is and why it's vulnerable
- Common tools and frameworks used by attackers — briefly explain what each tool does
- Detection indicators and defensive signatures — explain what defenders look for and why
- Reference how attacks in the news articles were conducted where applicable
Minimum 350 words. Use sub-headings and numbered lists for clarity.

IMPACT SECTION:
Write a detailed impact analysis that anyone can understand, covering:
- Financial consequences explained with relatable comparisons (direct costs, indirect costs, long-term costs)
- Operational disruption — what actually happens day-to-day when this attack hits (downtime, recovery time, business continuity)
- Strategic and reputational consequences — how it affects trust and brand image
- Regulatory and compliance implications — what laws or rules come into play, explained simply
- Supply chain and third-party effects — how it ripples beyond the initial victim
- Include specific examples from the news articles about real-world impacts
Minimum 300 words. Use sub-headings to separate impact categories.`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Blue Team content generated successfully');
      return this.parseBlueTeamContent(content, attack.name);
    } catch (error) {
      console.log('❌ AI Blue Team generation failed:', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackBlueTeamContent(attack.name);
    }
  }

  async generateRedTeamContent(attack: any, newsArticles: any[]) {
    const newsContext = this.createNewsContext(newsArticles);

    const attackContext = `Attack Type: "${attack.name}"
Attack Description: ${attack.description}
Attack Category: ${attack.category}
Attack Difficulty: ${attack.difficulty}

Recent Real-World Examples from News:
${newsContext}`;

    const sharedRules = `FORMATTING RULES:
- Use ### for sub-headings (e.g., "### Primary Goals", "### Phase 1: Reconnaissance")
- Use **bold** for key terms, tools, techniques, and important concepts
- Use bullet points (- ) for listing items, tools, or indicators
- Use numbered lists (1. 2. 3.) for sequential steps or phases
- Separate paragraphs with a blank line between them
- Keep paragraphs focused — one idea per paragraph, 3-5 sentences each
- Do NOT place headings in the middle of a paragraph. Always put a blank line before and after any ### heading.

LANGUAGE RULES:
- Write in simple, conversational English. Imagine explaining this to a smart friend who has zero cybersecurity background.
- Every technical term MUST be explained on first use. Put a plain-English explanation in parentheses right after the term, e.g. "OSINT (Open Source Intelligence — gathering information from publicly available sources like social media and websites)".
- Use real-world analogies to make attack concepts tangible, e.g. "Privilege escalation is like a regular employee finding an unlocked manager's office and using their computer to access restricted files."
- Avoid jargon-heavy sentences. If a sentence has more than 2 technical terms, break it into shorter sentences and explain each term.
- Use "you" and "your" to make it feel personal, e.g. "If you were the attacker, your first step would be..."`;

    const objectivesAndMethodologyPrompt = `You are a senior red team operator writing in-depth educational content for "Oh-My-Security", a daily cybersecurity education platform.

${attackContext}

${sharedRules}

Your response MUST contain EXACTLY two sections with these EXACT markers on their own lines:

OBJECTIVES SECTION:
Write a detailed, beginner-friendly explanation of attacker goals for ${attack.name} covering:
- Primary strategic objectives explained simply — what do attackers actually want? (money, data, chaos, spying)
- Secondary objectives and opportunistic goals — what else might they grab along the way?
- Target selection criteria and victim profiling — how do attackers pick their victims? Explain the thought process.
- What attackers achieved in the real-world news examples provided
- Motivation analysis — explain each type (nation-state, criminal, hacktivist, insider) with a one-line description of who they are
Minimum 350 words. Use sub-headings to organize.

METHODOLOGY SECTION:
Write a detailed multi-phase attack methodology for ${attack.name} that reads like a story — walk the reader through each step as if narrating a heist movie:
- Phase 1: Reconnaissance and target profiling — explain OSINT, scanning, enumeration in plain terms
- Phase 2: Weaponization and payload development — what the attacker builds and why
- Phase 3: Initial access and delivery mechanisms — how they get their foot in the door
- Phase 4: Exploitation and code execution — what happens when the attack fires
- Phase 5: Persistence and privilege escalation — how they stay in and gain more power
- Phase 6: Lateral movement and internal reconnaissance — how they spread through the network
- Phase 7: Data collection and objective execution — grabbing what they came for
- Phase 8: Exfiltration and cleanup — getting the stolen goods out and covering tracks
- Tools, frameworks, and TTPs used at each phase — name each tool and explain what it does in one sentence (reference MITRE ATT&CK where applicable, and explain what MITRE ATT&CK is on first mention)
- Insights from how the attacks in the news articles were conducted
Minimum 400 words. Use numbered phases with sub-headings for each.

YOU MUST WRITE BOTH SECTIONS IN FULL. Do NOT stop after the objectives section.`;

    const exploitCodePrompt = `You are a senior red team operator writing educational exploit code examples for "Oh-My-Security", a daily cybersecurity education platform.

${attackContext}

Write educational, well-commented code examples that demonstrate the ${attack.name} technique.

Start with this header:
# ${attack.name} — Educational Simulation Framework
# WARNING: For authorized educational and testing purposes only
# Environment: Controlled lab / authorized penetration test only

Include:
- Multiple code snippets showing different aspects of the attack
- Clear comments in plain English explaining what each section does, WHY it works, and what a defender would see
- Write code comments so a beginner can understand — explain not just WHAT each line does, but WHY an attacker would do it
- Detection signatures or indicators that defenders should watch for — explain each one
- Mitigation code showing how to defend against each technique, with comments explaining the defense logic

Do NOT use markdown formatting. Just write plain code with comments.`;

    try {
      console.log('🔄 [Red Team] Generating objectives + methodology...');
      const objMethodContent = await this.generateContent(objectivesAndMethodologyPrompt);
      console.log('✅ [Red Team] Objectives + methodology done (' + objMethodContent.length + ' chars)');

      const objectivesSection = this.extractSection(objMethodContent, 'OBJECTIVES SECTION:', ['METHODOLOGY SECTION:']);
      const methodologySection = this.extractSection(objMethodContent, 'METHODOLOGY SECTION:', []);

      console.log('🔄 [Red Team] Generating exploit code...');
      const exploitContent = await this.generateContent(exploitCodePrompt, CODE_MODELS);
      console.log('✅ [Red Team] Exploit code done (' + exploitContent.length + ' chars)');

      console.log('✅ AI Red Team content generated — objectives:', objectivesSection.length, '| methodology:', methodologySection.length, '| exploit:', exploitContent.length);

      const fallback = this.getFallbackRedTeamContent(attack.name);
      return {
        objectives: this.cleanAndFormatMarkdown(objectivesSection) || fallback.objectives,
        methodology: this.cleanAndFormatMarkdown(methodologySection) || fallback.methodology,
        exploitCode: this.cleanExploitCode(exploitContent) || fallback.exploitCode,
      };
    } catch (error) {
      console.log('❌ AI Red Team generation failed:', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackRedTeamContent(attack.name);
    }
  }

  private createNewsContext(articles: any[]): string {
    if (!articles || articles.length === 0) {
      return 'No recent news articles found for this attack type.';
    }

    const topArticles = articles.slice(0, 3);

    return topArticles.map((article, index) => {
      // Safely extract properties with fallbacks
      const title = article?.title || 'Untitled Article';
      const sourceName = article?.source?.name || 'Unknown Source';
      const publishedAt = article?.publishedAt || new Date().toISOString();
      const description = article?.description || 'No description available';

      const date = new Date(publishedAt).toLocaleDateString();
      return `${index + 1}. "${title}" - ${sourceName} (${date})
   Summary: ${description}`;
    }).join('\n\n');
  }

  private async generateContent(prompt: string, models: string[] = CONTENT_MODELS): Promise<string> {
    for (let modelIdx = 0; modelIdx < models.length; modelIdx++) {
      const model = models[modelIdx];
      try {
        console.log(`🔄 [AI] Calling OpenRouter — model: ${model}`);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://oh-my-security.vercel.app',
            'X-Title': 'Oh-My-Security',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are a senior cybersecurity expert and gifted educator. Write in simple, clear language that a complete beginner can understand — but never sacrifice depth or accuracy. When you use a technical term, immediately explain it in plain English in parentheses, e.g. "SQL injection (a trick where attackers slip malicious database commands into a website\'s input fields)". Use analogies and real-world comparisons to make complex ideas click. Follow the formatting instructions in the user message EXACTLY. Always use the EXACT section markers specified. Your response must be comprehensive, detailed, and thorough — minimum 350 words per section. Aim for longer, richer explanations rather than shorter ones.',
              },
              {
                role: 'user',
                content: prompt,
              }
            ],
            temperature: 0.7,
            max_tokens: 8192,
          })
        });

        console.log(`📡 [AI] ${model} — ${response.status} ${response.statusText}`);

        if (response.status === 429) {
          const errorBody = await response.text().catch(() => '');
          console.log(`⚠️ [AI] ${model} rate limited (429), trying next model — ${errorBody.substring(0, 200)}`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`❌ [AI] ${model} error: ${errorBody.substring(0, 500)}`);
          continue;
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content;
        const finishReason = data.choices?.[0]?.finish_reason;
        const usage = data.usage;

        console.log('📊 [AI] Response stats — finish_reason:', finishReason, '| content length:', generatedText?.length || 0, '| tokens:', JSON.stringify(usage || {}));
        console.log('📝 [AI] First 300 chars:', generatedText?.substring(0, 300) || 'EMPTY');

        if (!generatedText) {
          console.error('❌ [AI] Empty response, trying next model');
          continue;
        }

        return generatedText;
      } catch (error) {
        console.error(`❌ [AI] ${model} failed:`, error instanceof Error ? error.message : 'Unknown error');
        if (modelIdx < models.length - 1) {
          console.log('🔄 [AI] Trying next fallback model...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        throw new Error(`OpenRouter API error: All models failed. Last: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    throw new Error('OpenRouter API error: All fallback models exhausted');
  }

  private extractSection(text: string, startMarker: string, endMarkers: string[]): string {
    // Strategy 1: Exact marker match (case-insensitive)
    const startIndex = text.toLowerCase().indexOf(startMarker.toLowerCase());
    if (startIndex !== -1) {
      let endIndex = text.length;
      for (const marker of endMarkers) {
        const markerIndex = text.toLowerCase().indexOf(marker.toLowerCase(), startIndex + startMarker.length);
        if (markerIndex !== -1 && markerIndex < endIndex) {
          endIndex = markerIndex;
        }
      }
      return text.substring(startIndex + startMarker.length, endIndex).trim();
    }

    // Strategy 2: Flexible marker — look for the keyword without "SECTION:" suffix
    // e.g., "ABOUT SECTION:" → try "ABOUT:", "About:", "## About", "# About"
    const keyword = startMarker.replace(/\s*SECTION:\s*$/i, '').trim();
    const flexPatterns = [
      new RegExp(`^\\s*${keyword}\\s*:\\s*$`, 'im'),
      new RegExp(`^\\s*#+\\s*${keyword}`, 'im'),
      new RegExp(`^\\s*\\*\\*${keyword}\\*\\*`, 'im'),
    ];

    for (const pattern of flexPatterns) {
      const match = text.match(pattern);
      if (match && match.index !== undefined) {
        const sectionStart = match.index + match[0].length;
        let endIndex = text.length;

        // Look for end markers with same flexible matching
        for (const endMarker of endMarkers) {
          const endKeyword = endMarker.replace(/\s*SECTION:\s*$/i, '').trim();
          const endPatterns = [
            new RegExp(`^\\s*${endKeyword}\\s*SECTION:\\s*$`, 'im'),
            new RegExp(`^\\s*${endKeyword}\\s*:\\s*$`, 'im'),
            new RegExp(`^\\s*#+\\s*${endKeyword}`, 'im'),
            new RegExp(`^\\s*\\*\\*${endKeyword}\\*\\*`, 'im'),
          ];
          for (const ep of endPatterns) {
            const endMatch = text.substring(sectionStart).match(ep);
            if (endMatch && endMatch.index !== undefined) {
              const candidateEnd = sectionStart + endMatch.index;
              if (candidateEnd < endIndex) {
                endIndex = candidateEnd;
              }
            }
          }
        }

        const result = text.substring(sectionStart, endIndex).trim();
        if (result.length > 0) return result;
      }
    }

    return '';
  }

  private parseBlueTeamContent(content: string, attackType: string) {
    console.log('🔍 [Parse] Parsing Blue Team content — total length:', content.length);

    // Check which markers exist in the content
    const hasAbout = /about\s*section\s*:/i.test(content);
    const hasHowItWorks = /how\s*it\s*works\s*section\s*:/i.test(content);
    const hasImpact = /impact\s*section\s*:/i.test(content);
    console.log('🔍 [Parse] Markers found — ABOUT:', hasAbout, '| HOW IT WORKS:', hasHowItWorks, '| IMPACT:', hasImpact);

    let aboutSection = this.extractSection(content, 'ABOUT SECTION:', ['HOW IT WORKS SECTION:', 'IMPACT SECTION:']);
    let howItWorksSection = this.extractSection(content, 'HOW IT WORKS SECTION:', ['IMPACT SECTION:']);
    let impactSection = this.extractSection(content, 'IMPACT SECTION:', []);

    console.log('🔍 [Parse] Extracted lengths — about:', aboutSection.length, '| howItWorks:', howItWorksSection.length, '| impact:', impactSection.length);

    // Strategy 3: If no markers found at all, try splitting by ## headings or proportionally
    if (!aboutSection && !howItWorksSection && !impactSection && content.length > 200) {
      console.log('⚠️ [Parse] No section markers found — attempting heading-based split');
      const sections = this.splitByHeadingsOrProportionally(content, 3);
      aboutSection = sections[0] || '';
      howItWorksSection = sections[1] || '';
      impactSection = sections[2] || '';
      console.log('🔍 [Parse] Heading split lengths — about:', aboutSection.length, '| howItWorks:', howItWorksSection.length, '| impact:', impactSection.length);
    }

    const result = {
      about: this.cleanAndFormatMarkdown(aboutSection) || this.getFallbackBlueTeamContent(attackType).about,
      howItWorks: this.cleanAndFormatMarkdown(howItWorksSection) || this.getFallbackBlueTeamContent(attackType).howItWorks,
      impact: this.cleanAndFormatMarkdown(impactSection) || this.getFallbackBlueTeamContent(attackType).impact,
    };

    // Log whether we're using AI content or fallback
    const usingFallback = [
      !aboutSection ? 'about' : null,
      !howItWorksSection ? 'howItWorks' : null,
      !impactSection ? 'impact' : null,
    ].filter(Boolean);
    if (usingFallback.length > 0) {
      console.log('⚠️ [Parse] Using FALLBACK for sections:', usingFallback.join(', '));
    } else {
      console.log('✅ [Parse] All Blue Team sections extracted from AI content');
    }

    return result;
  }

  private parseRedTeamContent(content: string, attackType: string) {
    console.log('🔍 [Parse] Parsing Red Team content — total length:', content.length);

    const hasObjectives = /objectives\s*section\s*:/i.test(content);
    const hasMethodology = /methodology\s*section\s*:/i.test(content);
    const hasExploit = /exploit\s*code\s*section\s*:/i.test(content);
    console.log('🔍 [Parse] Markers found — OBJECTIVES:', hasObjectives, '| METHODOLOGY:', hasMethodology, '| EXPLOIT CODE:', hasExploit);

    let objectivesSection = this.extractSection(content, 'OBJECTIVES SECTION:', ['METHODOLOGY SECTION:', 'EXPLOIT CODE SECTION:']);
    let methodologySection = this.extractSection(content, 'METHODOLOGY SECTION:', ['EXPLOIT CODE SECTION:']);
    let exploitSection = this.extractSection(content, 'EXPLOIT CODE SECTION:', []);

    console.log('🔍 [Parse] Extracted lengths — objectives:', objectivesSection.length, '| methodology:', methodologySection.length, '| exploit:', exploitSection.length);

    // Strategy 3: If no markers found at all, try splitting by ## headings or proportionally
    if (!objectivesSection && !methodologySection && !exploitSection && content.length > 200) {
      console.log('⚠️ [Parse] No section markers found — attempting heading-based split');
      const sections = this.splitByHeadingsOrProportionally(content, 3);
      objectivesSection = sections[0] || '';
      methodologySection = sections[1] || '';
      exploitSection = sections[2] || '';
      console.log('🔍 [Parse] Heading split lengths — objectives:', objectivesSection.length, '| methodology:', methodologySection.length, '| exploit:', exploitSection.length);
    }

    const result = {
      objectives: this.cleanAndFormatMarkdown(objectivesSection) || this.getFallbackRedTeamContent(attackType).objectives,
      methodology: this.cleanAndFormatMarkdown(methodologySection) || this.getFallbackRedTeamContent(attackType).methodology,
      exploitCode: this.cleanExploitCode(exploitSection) || this.getFallbackRedTeamContent(attackType).exploitCode,
    };

    const usingFallback = [
      !objectivesSection ? 'objectives' : null,
      !methodologySection ? 'methodology' : null,
      !exploitSection ? 'exploitCode' : null,
    ].filter(Boolean);
    if (usingFallback.length > 0) {
      console.log('⚠️ [Parse] Using FALLBACK for sections:', usingFallback.join(', '));
    } else {
      console.log('✅ [Parse] All Red Team sections extracted from AI content');
    }

    return result;
  }

  /**
   * Split content by major headings (## or ###) or proportionally if no headings found.
   * Used as a last-resort fallback when the AI doesn't use our exact section markers.
   */
  private splitByHeadingsOrProportionally(content: string, numSections: number): string[] {
    // Try splitting by ## or ### level headings
    const headingPattern = /^#{1,3}\s+.+$/gm;
    const headings: { index: number; match: string }[] = [];
    let match;
    while ((match = headingPattern.exec(content)) !== null) {
      headings.push({ index: match.index, match: match[0] });
    }

    if (headings.length >= numSections) {
      // Use heading positions as section boundaries
      const sections: string[] = [];
      for (let i = 0; i < numSections; i++) {
        const start = headings[i].index;
        const end = i + 1 < headings.length ? headings[i + 1].index : content.length;
        // For sections beyond our count, append to the last section
        if (i === numSections - 1) {
          sections.push(content.substring(start).trim());
        } else {
          sections.push(content.substring(start, end).trim());
        }
      }
      return sections;
    }

    // Proportional split as absolute last resort
    const chunkSize = Math.floor(content.length / numSections);
    const sections: string[] = [];
    for (let i = 0; i < numSections; i++) {
      const start = i * chunkSize;
      const end = i === numSections - 1 ? content.length : (i + 1) * chunkSize;
      // Try to split at paragraph boundary
      let splitEnd = end;
      if (i < numSections - 1) {
        const nextParagraph = content.indexOf('\n\n', end - 100);
        if (nextParagraph !== -1 && nextParagraph < end + 200) {
          splitEnd = nextParagraph;
        }
      }
      sections.push(content.substring(start, splitEnd).trim());
    }
    return sections;
  }

  private cleanAndFormatMarkdown(text: string): string {
    if (!text) return '';
    let formatted = text;
    // Strip stray section markers
    formatted = formatted.replace(/^(ABOUT|HOW IT WORKS|IMPACT|OBJECTIVES|METHODOLOGY|EXPLOIT CODE)\s*SECTION:\s*/gim, '');
    // Normalize headings to ###
    formatted = formatted.replace(/^#{1,2}\s+/gm, '### ');
    // Ensure blank line before headings
    formatted = formatted.replace(/([^\n])\n(###\s)/g, '$1\n\n$2');
    // Ensure blank line after headings
    formatted = formatted.replace(/(###\s.+)\n([^\n#])/g, '$1\n\n$2');
    // Normalize bullets to -
    formatted = formatted.replace(/^\s*[•*+]\s+/gm, '- ');
    // Ensure spacing around list blocks
    formatted = formatted.replace(/([^\n-])\n(- )/g, '$1\n\n$2');
    formatted = formatted.replace(/(- .+)\n([^\n-])/g, '$1\n\n$2');
    // Normalize numbered lists
    formatted = formatted.replace(/^\s*(\d+)\)\s+/gm, '$1. ');
    // Collapse excessive blank lines
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    // Trim leading whitespace on non-list lines
    formatted = formatted.replace(/^[ \t]+(?![-\d])/gm, '');
    formatted = formatted.trim();
    return formatted;
  }

  private cleanExploitCode(text: string): string {
    if (!text) return '';
    let code = text;
    // Strip markdown code fences
    code = code.replace(/^```[\w]*\s*$/gm, '');
    code = code.replace(/\n```\s*$/g, '');
    // Collapse excessive blank lines
    code = code.replace(/\n{3,}/g, '\n\n');
    return code.trim();
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
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  const searchApiKey = process.env.OPENROUTER_SEARCH_API_KEY || openrouterApiKey;

  if (!newsApiKey || !openrouterApiKey) {
    throw new Error('Missing required API keys: NEWS_API_KEY and OPENROUTER_API_KEY must be set');
  }

  const newsService = new NewsAPIService(newsApiKey, searchApiKey!);
  const aiService = new AIContentGenerator(openrouterApiKey);

  // Fetch recently used attacks from Supabase to avoid duplicates
  mockSpinner.start('Checking recently used attack types...');
  const { data: recentContent, error: recentError } = await supabaseAdmin
    .from('daily_content')
    .select('attack_type, date')
    .order('date', { ascending: false })
    .limit(10);

  const recentlyUsedAttackNames = recentContent?.map(c => c.attack_type) || [];
  const recentlyUsedAttackIds = ATTACK_METHODOLOGIES
    .filter(attack => recentlyUsedAttackNames.includes(attack.name))
    .map(attack => attack.id);

  console.log(`📋 Recently used attacks (last 10): ${recentlyUsedAttackNames.slice(0, 5).join(', ')}...`);

  // Select next attack methodology (avoid recently used ones)
  const availableAttacks = ATTACK_METHODOLOGIES.filter(
    attack => !recentlyUsedAttackIds.includes(attack.id)
  );

  let selectedAttack;
  if (availableAttacks.length === 0) {
    // If all attacks have been recently used, exclude only the last 3
    const veryRecentAttacks = recentlyUsedAttackIds.slice(0, 3);
    const lessRecentlyAvailable = ATTACK_METHODOLOGIES.filter(
      attack => !veryRecentAttacks.includes(attack.id)
    );
    selectedAttack = lessRecentlyAvailable[Math.floor(Math.random() * lessRecentlyAvailable.length)];
    mockSpinner.warn('All attacks recently used, selecting from less recent pool');
  } else {
    selectedAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
    mockSpinner.succeed(`Found ${availableAttacks.length} available attacks not recently used`);
  }

  mockSpinner.succeed(`Selected: ${selectedAttack.name}`);
  console.log(`📚 Category: ${selectedAttack.category}`);
  console.log(`🎯 Difficulty: ${selectedAttack.difficulty}`);

  // Search for relevant news
  mockSpinner.start(`Searching for news about ${selectedAttack.name}...`);
  let articles = await newsService.fetchNewsForAttack(selectedAttack);

  if (articles.length === 0) {
    mockSpinner.warn(`No relevant articles found for ${selectedAttack.name} - will use fallback content`);
  } else {
    mockSpinner.succeed(`Found ${articles.length} relevant articles`);
  }

  if (articles.length > 0) {
    console.log(`📰 Top article: "${articles[0].title}" - ${articles[0].source.name}`);
  }

  // Generate comprehensive content using AI — sequential to avoid 429 rate limits
  mockSpinner.start('Generating blue team content with AI...');
  const blueTeamContent = await aiService.generateBlueTeamContent(selectedAttack, articles);
  mockSpinner.succeed('Blue team content generated');

  mockSpinner.start('Generating red team content with AI...');
  const redTeamContent = await aiService.generateRedTeamContent(selectedAttack, articles);
  mockSpinner.succeed('Red team content generated');

  // Use Indian Standard Time (IST) for date generation
  // This ensures content is generated for the correct Indian date at 12:01 AM IST
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const currentDate = now.toLocaleDateString('en-CA', options); // Returns YYYY-MM-DD format

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
    } : null, // No article when no relevant match found
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

    // Check for AI API key (OpenRouter)
    if (!process.env.OPENROUTER_API_KEY) {
      missingVars.push('OPENROUTER_API_KEY');
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

    // Trigger direct cache revalidation (internal, no HTTP calls needed)
    mockSpinner.start('Refreshing cached pages...');
    try {
      // Revalidate all main pages
      revalidatePath('/', 'page');
      revalidatePath('/archive', 'page');
      revalidatePath('/day/[date]', 'page');
      revalidatePath(`/day/${content.date}`, 'page');

      // Revalidate content-related tags
      revalidateTag('content');
      revalidateTag('latest-content');
      revalidateTag('archive');
      revalidateTag('homepage');
      revalidateTag('all-content');
      revalidateTag('content-by-date');
      revalidateTag(`content-${content.date}`);

      mockSpinner.succeed('Pages and cache refreshed successfully');
      console.log('✅ Direct cache revalidation completed successfully');
    } catch (revalidateError) {
      mockSpinner.warn('Cache refresh encountered an issue, but content was stored');
      console.error('Direct revalidation error:', revalidateError);
    }

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

    // Clean up old content to maintain 20-day retention
    mockSpinner.start('Cleaning up old content...');
    try {
      // Clean up old Supabase content
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 20);
      const cutoffDateStr = cutoffDate.toISOString().split('T')[0];

      const { error: deleteError } = await supabaseAdmin
        .from('daily_content')
        .delete()
        .lt('date', cutoffDateStr);

      if (deleteError) {
        throw new Error(`Supabase cleanup failed: ${deleteError.message}`);
      }

      // Also clean up filesystem if in development
      if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs/promises');
        const path = await import('path');

        try {
          const contentDir = path.join(process.cwd(), 'content');
          const files = await fs.readdir(contentDir);
          const jsonFiles = files.filter(file => file.endsWith('.json') && file !== '.generation-history.json');
          
          let deletedCount = 0;
          for (const file of jsonFiles) {
            const fileDate = new Date(file.replace('.json', ''));
            if (fileDate < cutoffDate) {
              await fs.unlink(path.join(contentDir, file));
              deletedCount++;
            }
          }
          
          if (deletedCount > 0) {
            console.log(`🗑️  Cleaned up ${deletedCount} old filesystem files`);
          }
        } catch (fsError) {
          console.log('⚠️  Filesystem cleanup failed (Supabase cleanup succeeded)');
        }
      }

      mockSpinner.succeed('Old content cleaned up successfully');
    } catch (cleanupError) {
      mockSpinner.warn('Content cleanup failed (content still generated)');
      console.error('Cleanup error:', cleanupError);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Cron job completed successfully in ${duration}ms`);

    return Response.json({
      success: true,
      message: 'Daily content generated and stored with immediate cache refresh',
      date: content.date,
      attackType: content.attackType,
      category: content.metadata.category,
      difficulty: content.metadata.difficulty,
      articlesUsed: content.metadata.newsArticlesUsed,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      storage: 'Supabase (Primary)',
      cacheRevalidation: 'Internal (Direct)',
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
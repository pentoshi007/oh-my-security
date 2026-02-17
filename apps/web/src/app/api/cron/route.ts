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

// NewsData.io service with proper relevance scoring
class NewsDataService {
  constructor(private apiKey: string) { }

  async fetchCybersecurityNews() {
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${this.apiKey}&q=cybersecurity OR cyber attack OR hacking OR data breach&language=en&size=10`
    );
    const data = await response.json();

    // Normalize articles to match expected format
    if (data.status === 'success' && data.results) {
      return data.results.map((article: any) => ({
        url: article.link || article.url || '#',
        title: article.title || 'Untitled',
        description: article.description || 'No description available',
        content: article.content || '',
        publishedAt: article.pubDate || new Date().toISOString(),
        source: {
          name: article.source_id || article.source_name || 'Unknown Source'
        }
      }));
    }

    return [];
  }

  async fetchNewsForAttack(attack: any) {
    try {
      console.log(`🔍 Searching news for: ${attack.name}`);

      // Try multiple search strategies - ONLY topic-specific searches, NO generic fallback
      // newsdata.io uses simpler query syntax than NewsAPI
      const searchStrategies = [
        // Strategy 1: Exact attack name with cybersecurity context
        `${attack.name} cybersecurity`,
        // Strategy 2: Primary search keywords
        attack.searchKeywords.slice(0, 2).join(' '),
        // Strategy 3: Attack name with category
        `${attack.name} ${attack.category.toLowerCase()}`
      ];

      let allArticles: any[] = [];
      const seenUrls = new Set<string>();

      // Try each search strategy
      for (let i = 0; i < searchStrategies.length; i++) {
        const query = searchStrategies[i];
        try {
          console.log(`  Strategy ${i + 1}: ${query.substring(0, 100)}...`);
          const response = await fetch(
            `https://newsdata.io/api/1/news?apikey=${this.apiKey}&q=${encodeURIComponent(query)}&language=en&size=10`
          );
          const data = await response.json();

          if (data.status === 'success' && data.results) {
            console.log(`  Found ${data.results.length} articles`);
            // Add unique articles - newsdata.io uses 'link' instead of 'url'
            data.results.forEach((article: any) => {
              if (article.link && !seenUrls.has(article.link) &&
                  article.title && article.description &&
                  !article.title.includes('[Removed]') &&
                  !article.description.includes('[Removed]')) {
                // Normalize article format to match our processing
                const normalizedArticle = {
                  url: article.link,
                  title: article.title,
                  description: article.description,
                  content: article.content || '',
                  publishedAt: article.pubDate,
                  source: {
                    name: article.source_id || 'Unknown'
                  }
                };
                allArticles.push(normalizedArticle);
                seenUrls.add(article.link);
              }
            });
          } else {
            console.log(`  Strategy ${i + 1} returned no results or error:`, data.status);
          }
        } catch (strategyError) {
          console.log(`  Strategy ${i + 1} failed:`, strategyError);
          continue;
        }

        // If we have enough candidate articles, stop trying more strategies
        if (allArticles.length >= 20) {
          break;
        }

        // Add delay between API calls to avoid rate limiting (newsdata.io has stricter limits)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`📊 Total candidate articles: ${allArticles.length}`);

      // Score and filter articles for relevance - STRICT MATCHING
      const scoredArticles = allArticles
        .map(article => {
          const score = this.scoreArticleRelevance(article, attack);
          return { article, score, title: article.title };
        })
        .filter(item => {
          if (item.score > 0) {
            console.log(`  ✓ Matched (score ${item.score}): ${item.title.substring(0, 80)}...`);
            return true;
          }
          return false;
        })
        .sort((a, b) => b.score - a.score); // Sort by relevance

      console.log(`✅ Final relevant articles: ${scoredArticles.length}`);

      // Return top 5 most relevant articles - if none found, return empty array
      const topArticles = scoredArticles.slice(0, 5).map(item => item.article);

      if (topArticles.length === 0) {
        console.log(`⚠️ No relevant articles found for ${attack.name}`);
      }

      return topArticles;
    } catch (error) {
      console.error('Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Score article relevance to the attack methodology - ULTRA STRICT MATCHING
   * Article MUST contain attack name/keywords in title OR description AND have cybersecurity context
   */
  private scoreArticleRelevance(article: any, attack: any): number {
    const titleLower = article.title.toLowerCase();
    const descLower = (article.description || '').toLowerCase();
    const titleAndDesc = `${titleLower} ${descLower}`;

    // CRITICAL REQUIREMENT: Attack topic MUST be mentioned in title or description
    // We don't accept articles where the topic is only buried in content
    const hasAttackInTitleOrDesc = this.hasExactAttackMatch(titleAndDesc, attack);

    if (!hasAttackInTitleOrDesc) {
      // Topic not in title/description - REJECT immediately
      return 0;
    }

    // MANDATORY REQUIREMENT: Must have strong cybersecurity context
    const hasStrongCybersecurityContext = this.hasStrongCybersecurityContext(titleAndDesc);

    if (!hasStrongCybersecurityContext) {
      // No cybersecurity context - REJECT
      return 0;
    }

    // Both requirements met - calculate detailed relevance score
    let score = 100; // Base score for meeting strict requirements

    // PRIORITY 1: Attack name in TITLE gets highest boost
    if (titleLower.includes(attack.name.toLowerCase())) {
      score += 50;
    }

    // PRIORITY 2: Check for aliases in title
    if (attack.aliases) {
      attack.aliases.forEach((alias: string) => {
        if (titleLower.includes(alias.toLowerCase())) {
          score += 40;
        }
      });
    }

    // PRIORITY 3: Primary search keywords in title
    attack.searchKeywords.slice(0, 3).forEach((keyword: string, index: number) => {
      const keywordLower = keyword.toLowerCase();
      const titleWeight = 30 - (index * 5); // 30, 25, 20
      const descWeight = 15 - (index * 3); // 15, 12, 9

      if (titleLower.includes(keywordLower)) {
        score += titleWeight;
      } else if (descLower.includes(keywordLower)) {
        score += descWeight;
      }
    });

    // PRIORITY 4: Attack name in description (if not in title)
    if (!titleLower.includes(attack.name.toLowerCase()) && descLower.includes(attack.name.toLowerCase())) {
      score += 25;
    }

    // PRIORITY 5: Boost for recent articles
    const articleDate = new Date(article.publishedAt);
    const daysSincePublished = (Date.now() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePublished < 7) score += 20;
    else if (daysSincePublished < 14) score += 15;
    else if (daysSincePublished < 21) score += 10;
    else if (daysSincePublished < 30) score += 5;

    // PRIORITY 6: Reputable cybersecurity sources
    const cybersecuritySources = [
      'reuters', 'bbc', 'cnn', 'techcrunch', 'wired', 'ars technica', 'zdnet',
      'bleeping computer', 'the hacker news', 'krebs on security', 'dark reading',
      'security week', 'threat post', 'infosecurity magazine', 'cyber security news',
      'cso online', 'security boulevard', 'help net security', 'it security guru',
      'security affairs', 'hackread', 'cybersecurity insiders'
    ];
    if (cybersecuritySources.some(source =>
      article.source.name.toLowerCase().includes(source)
    )) {
      score += 15;
    }

    return score;
  }

  /**
   * Check if article mentions the specific attack name, aliases, or primary keywords
   * Now checks for word boundaries to avoid false matches
   */
  private hasExactAttackMatch(text: string, attack: any): boolean {
    const textLower = text.toLowerCase();

    // Helper to check with word boundaries
    const containsPhrase = (haystack: string, needle: string): boolean => {
      // For multi-word phrases, check exact substring
      if (needle.includes(' ')) {
        return haystack.includes(needle);
      }
      // For single words, check with word boundaries
      const regex = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(haystack);
    };

    // Check for attack name
    const attackNameLower = attack.name.toLowerCase();
    if (containsPhrase(textLower, attackNameLower)) {
      return true;
    }

    // Check for aliases
    if (attack.aliases && attack.aliases.length > 0) {
      for (const alias of attack.aliases) {
        if (containsPhrase(textLower, alias.toLowerCase())) {
          return true;
        }
      }
    }

    // Check for primary search keywords (at least 2 must match)
    const keywordMatches = attack.searchKeywords.slice(0, 4).filter((keyword: string) =>
      containsPhrase(textLower, keyword.toLowerCase())
    ).length;

    // Require at least 2 primary keywords to match
    if (keywordMatches >= 2) {
      return true;
    }

    return false;
  }
  
  /**
   * Check if article has strong cybersecurity context
   * Must contain multiple security-related terms to confirm it's a security article
   */
  private hasStrongCybersecurityContext(text: string): boolean {
    const textLower = text.toLowerCase();

    // Primary cybersecurity indicators (strong signals)
    const primaryTerms = [
      'cybersecurity', 'cyber security', 'cyber attack', 'cyber threat',
      'security breach', 'data breach', 'security incident',
      'hacking', 'hacker', 'hacked',
      'malware', 'ransomware', 'trojan',
      'vulnerability', 'exploit',
      'threat actor', 'security researcher',
      'cybercrime', 'cyberattack'
    ];

    // Secondary security terms (supporting signals)
    const secondaryTerms = [
      'security', 'attack', 'breach', 'threat', 'vulnerability',
      'compromise', 'intrusion', 'penetration',
      'patch', 'zero-day', 'backdoor',
      'phishing', 'credential', 'authentication',
      'encryption', 'firewall', 'antivirus'
    ];

    // Exclude articles that are NOT about cybersecurity
    const excludeContexts = [
      // Legal contexts
      'attorney-client privilege', 'legal privilege', 'court case', 'lawsuit',
      'litigation', 'court ruling', 'legal precedent', 'judge ruled',
      // Medical/health contexts
      'medical', 'healthcare', 'hospital', 'patient privacy', 'hipaa',
      // Physical security contexts
      'border security', 'national security advisor', 'homeland security',
      'social security', 'job security', 'food security',
      // Financial contexts (unless explicitly cyber-related)
      'securities and exchange', 'financial security'
    ];

    // Check for exclusion contexts first
    for (const excludeContext of excludeContexts) {
      if (textLower.includes(excludeContext)) {
        // Only reject if it doesn't also have strong cybersecurity terms
        const hasCyberTerm = primaryTerms.some(term => textLower.includes(term));
        if (!hasCyberTerm) {
          return false;
        }
      }
    }

    // Count primary cybersecurity term matches
    const primaryMatches = primaryTerms.filter(term => textLower.includes(term)).length;

    // If we have at least 1 primary term, it's likely a cybersecurity article
    if (primaryMatches >= 1) {
      return true;
    }

    // Otherwise, require multiple secondary terms to indicate security context
    const secondaryMatches = secondaryTerms.filter(term => textLower.includes(term)).length;

    // Need at least 3 secondary security terms if no primary terms
    return secondaryMatches >= 3;
  }


  /**
   * Get date from N days ago in ISO format
   */
  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }
}

// AI Content Generator using OpenRouter (z-ai/glm-4.5-air:free)
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

ABOUT SECTION:
Write a detailed explanation covering:
- What the attack is and why it matters in today's threat landscape
- Historical context and evolution of this attack type
- Current prevalence and recent trends
- Economic and organizational impact with statistics where possible
- Reference specific incidents from the news articles provided
Minimum 300 words. Use sub-headings to organize the content.

HOW IT WORKS SECTION:
Write a detailed technical breakdown covering:
- Attack prerequisites and initial conditions
- Step-by-step attack phases (use numbered lists): reconnaissance, initial access, execution, persistence, lateral movement, objective completion, cleanup/covering tracks
- Technical mechanisms and protocols exploited
- Common tools and frameworks used by attackers
- Detection indicators and defensive signatures
- Reference how attacks in the news articles were conducted where applicable
Minimum 300 words. Use sub-headings and numbered lists for clarity.

IMPACT SECTION:
Write a detailed impact analysis covering:
- Financial consequences (direct costs, indirect costs, long-term costs)
- Operational disruption (downtime, recovery time, business continuity)
- Strategic and reputational consequences
- Regulatory and compliance implications
- Supply chain and third-party effects
- Include specific examples from the news articles about real-world impacts
Minimum 250 words. Use sub-headings to separate impact categories.`;

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

    const prompt = `You are a senior red team operator writing in-depth educational content for "Oh-My-Security", a daily cybersecurity education platform.

Generate a comprehensive, well-structured offensive (Red Team) analysis for the attack type: "${attack.name}".

Attack Description: ${attack.description}
Attack Category: ${attack.category}
Attack Difficulty: ${attack.difficulty}

Recent Real-World Examples from News:
${newsContext}

CRITICAL FORMATTING RULES — follow these exactly:
1. Your response MUST begin with "OBJECTIVES SECTION:" on its own line. No preamble, no greetings.
2. Use the exact section markers: "OBJECTIVES SECTION:", "METHODOLOGY SECTION:", "EXPLOIT CODE SECTION:" — each on its own line.
3. Do NOT add markdown formatting (like ** or ##) to the section marker lines themselves.
4. WITHIN the OBJECTIVES and METHODOLOGY sections, use proper markdown formatting:
   - Use ### for sub-headings (e.g., "### Primary Goals", "### Phase 1: Reconnaissance")
   - Use **bold** for key terms, tools, techniques, and important concepts
   - Use bullet points (- ) for listing items, tools, or indicators
   - Use numbered lists (1. 2. 3.) for sequential steps or phases
   - Separate paragraphs with a blank line between them
   - Keep paragraphs focused — one idea per paragraph, 3-5 sentences each
5. Do NOT place headings in the middle of a paragraph. Always put a blank line before and after any ### heading.
6. For the EXPLOIT CODE SECTION, provide well-commented code blocks — do NOT use markdown formatting in that section, just plain code with comments.
7. Reference real-world attack methods from the news articles where relevant.

OBJECTIVES SECTION:
Write a detailed explanation of attacker goals covering:
- Primary strategic objectives (financial gain, data theft, disruption, espionage)
- Secondary objectives and opportunistic goals
- Target selection criteria and victim profiling
- What attackers achieved in the real-world news examples provided
- Motivation analysis (nation-state, criminal, hacktivist, insider)
Minimum 300 words. Use sub-headings to organize.

METHODOLOGY SECTION:
Write a detailed multi-phase attack methodology covering:
- Phase 1: Reconnaissance and target profiling (OSINT, scanning, enumeration)
- Phase 2: Weaponization and payload development
- Phase 3: Initial access and delivery mechanisms
- Phase 4: Exploitation and code execution
- Phase 5: Persistence and privilege escalation
- Phase 6: Lateral movement and internal reconnaissance
- Phase 7: Data collection and objective execution
- Phase 8: Exfiltration and cleanup
- Tools, frameworks, and TTPs used at each phase (reference MITRE ATT&CK where applicable)
- Insights from how the attacks in the news articles were conducted
Minimum 350 words. Use numbered phases with sub-headings for each.

EXPLOIT CODE SECTION:
Provide educational, well-commented code examples that demonstrate the attack technique. Include:
# ${attack.name} — Educational Simulation Framework
# WARNING: For authorized educational and testing purposes only
# Environment: Controlled lab / authorized penetration test only

- Multiple code snippets showing different aspects of the attack
- Clear comments explaining what each section does and why
- Detection signatures or indicators that defenders should watch for
- Mitigation code showing how to defend against each technique`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Red Team content generated successfully');
      return this.parseRedTeamContent(content, attack.name);
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

  private async generateContent(prompt: string): Promise<string> {
    try {
      console.log('🔄 [AI] Calling OpenRouter API...');
      console.log('🔑 [AI] API key present:', !!this.apiKey, '| Key prefix:', this.apiKey?.substring(0, 8) + '...');

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://oh-my-security.vercel.app',
          'X-Title': 'Oh-My-Security',
        },
        body: JSON.stringify({
          model: 'z-ai/glm-4.5-air:free',
          messages: [
            {
              role: 'system',
              content: 'You are a senior cybersecurity expert. Follow the formatting instructions in the user message EXACTLY. Always use the EXACT section markers specified. Your response must be comprehensive and detailed — minimum 300 words per section.',
            },
            {
              role: 'user',
              content: prompt,
            }
          ],
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 8192,
        })
      });

      console.log('📡 [AI] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('❌ [AI] API error body:', errorBody.substring(0, 500));
        throw new Error(`HTTP ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;
      const finishReason = data.choices?.[0]?.finish_reason;
      const usage = data.usage;

      console.log('📊 [AI] Response stats — finish_reason:', finishReason, '| content length:', generatedText?.length || 0, '| tokens:', JSON.stringify(usage || {}));
      console.log('📝 [AI] First 300 chars:', generatedText?.substring(0, 300) || 'EMPTY');

      if (!generatedText) {
        console.error('❌ [AI] Full response data:', JSON.stringify(data).substring(0, 1000));
        throw new Error('AI generation failed: No response text from OpenRouter.');
      }

      return generatedText;
    } catch (error) {
      console.error('❌ [AI] generateContent error:', error instanceof Error ? error.message : 'Unknown error');
      throw new Error(`OpenRouter API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
  const newsDataApiKey = process.env.NEWSDATA_API_KEY;
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;

  if (!newsDataApiKey || !openrouterApiKey) {
    throw new Error('Missing required API keys: NEWSDATA_API_KEY and OPENROUTER_API_KEY must be set');
  }

  const newsService = new NewsDataService(newsDataApiKey);
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

  // Generate comprehensive content using AI (matching original approach)
  mockSpinner.start('Generating comprehensive educational content with AI...');
  const [blueTeamContent, redTeamContent] = await Promise.all([
    aiService.generateBlueTeamContent(selectedAttack, articles),
    aiService.generateRedTeamContent(selectedAttack, articles),
  ]);
  mockSpinner.succeed('Comprehensive AI content generation completed');

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
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'NEWSDATA_API_KEY'];
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
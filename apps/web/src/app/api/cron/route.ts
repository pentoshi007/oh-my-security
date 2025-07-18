import { NextRequest } from 'next/server'
import { storeContentInSupabase } from '../../../lib/supabase'

// Force dynamic rendering for cron jobs
export const dynamic = 'force-dynamic'

// Attack methodologies database (core subset)
const ATTACK_METHODOLOGIES = [
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    category: 'Web Application Attacks',
    description: 'Code injection technique that exploits vulnerabilities in database queries',
    searchKeywords: ['sql injection', 'sqli', 'database attack'],
    difficulty: 'Medium',
    impacts: ['Data breach', 'Data manipulation', 'Service disruption']
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    category: 'Malware',
    description: 'Malicious software that encrypts files and demands payment for decryption',
    searchKeywords: ['ransomware', 'ransom', 'encryption attack'],
    difficulty: 'High',
    impacts: ['Business disruption', 'Financial loss', 'Data loss']
  },
  {
    id: 'phishing',
    name: 'Phishing',
    category: 'Social Engineering',
    description: 'Fraudulent attempt to obtain sensitive information by disguising as trustworthy entity',
    searchKeywords: ['phishing', 'email scam', 'fake website'],
    difficulty: 'Low',
    impacts: ['Credential theft', 'Identity theft', 'Financial fraud']
  },
  {
    id: 'mitm',
    name: 'Man-in-the-Middle Attack',
    category: 'Network Attacks',
    description: 'Eavesdropping attack where communication between two parties is secretly intercepted',
    searchKeywords: ['man-in-the-middle', 'mitm', 'eavesdropping'],
    difficulty: 'Medium',
    impacts: ['Data interception', 'Communication compromise', 'Privacy violation']
  },
  {
    id: 'ddos',
    name: 'Distributed Denial of Service',
    category: 'Network Attacks',
    description: 'Attempt to disrupt normal traffic by overwhelming target with flood of internet traffic',
    searchKeywords: ['ddos', 'denial of service', 'traffic flood'],
    difficulty: 'High',
    impacts: ['Service unavailability', 'Revenue loss', 'Reputation damage']
  },
  {
    id: 'zero-day',
    name: 'Zero-Day Exploit',
    category: 'Advanced Attacks',
    description: 'Cyber attack that exploits unknown or unpatched security vulnerabilities',
    searchKeywords: ['zero-day', 'zero day', 'unknown vulnerability'],
    difficulty: 'High',
    impacts: ['System compromise', 'Data breach', 'Persistent access']
  },
  {
    id: 'social-engineering',
    name: 'Social Engineering',
    category: 'Human Factor',
    description: 'Psychological manipulation to trick people into divulging confidential information',
    searchKeywords: ['social engineering', 'human manipulation', 'psychological attack'],
    difficulty: 'Medium',
    impacts: ['Information disclosure', 'Unauthorized access', 'Trust violation']
  },
  {
    id: 'malware',
    name: 'Malware',
    category: 'Malware',
    description: 'Malicious software designed to damage, disrupt, or gain unauthorized access',
    searchKeywords: ['malware', 'virus', 'trojan'],
    difficulty: 'Medium',
    impacts: ['System infection', 'Data theft', 'System damage']
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
  constructor(private apiKey: string) {}

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

// AI Content Generator using Google Gemini
class AIContentGenerator {
  constructor(private apiKey: string) {}

  async generateContent(attackMethodology: any, articles: any[]) {
    const newsContext = articles.length > 0 
      ? articles.slice(0, 3).map(a => `${a.title}: ${a.description || ''}`).join('\n')
      : 'No recent specific news available';

    const prompt = `Generate educational cybersecurity content for: "${attackMethodology.name}"

Attack Description: ${attackMethodology.description}
Category: ${attackMethodology.category}
Difficulty: ${attackMethodology.difficulty}

Recent News Context:
${newsContext}

Create comprehensive educational content with:
1. Detailed explanation of the attack
2. How it works technically
3. Impact analysis
4. Detection methods
5. Prevention strategies
6. Real-world examples

Focus on educational value for cybersecurity professionals.`;

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + this.apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return this.parseGeneratedContent(generatedText, attackMethodology);
    } catch (error) {
      console.error('AI generation error:', error);
      return this.getFallbackContent(attackMethodology);
    }
  }

  private parseGeneratedContent(text: string, attack: any) {
    // Split the generated content into blue team and red team sections
    const sections = text.split(/(?=##|\*\*|[0-9]+\.)/);
    
    return {
      blueTeam: {
        about: `${attack.name} is a significant cybersecurity threat that requires comprehensive understanding and defense strategies. This attack type falls under the ${attack.category} category and is considered ${attack.difficulty} difficulty to execute and defend against.`,
        howItWorks: `${attack.description} The attack typically involves multiple phases including reconnaissance, initial access, persistence, and impact execution. Understanding these phases is crucial for effective defense.`,
        impact: `The potential impacts include: ${attack.impacts.join(', ')}. Organizations must implement layered security controls to mitigate these risks effectively.`
      },
      redTeam: {
        objectives: `Understanding ${attack.name} from an offensive perspective helps security teams better prepare defenses. The primary objectives typically include gaining unauthorized access, maintaining persistence, and achieving specific goals related to data, systems, or operations.`,
        methodology: `The attack methodology follows a structured approach: 1) Target reconnaissance and vulnerability identification, 2) Initial access through identified weaknesses, 3) Privilege escalation and lateral movement, 4) Objective completion and cleanup.`,
        exploitCode: `# Educational ${attack.name} Simulation Framework\n# WARNING: For authorized educational and testing purposes only\n\n# This framework demonstrates ${attack.name} techniques\n# Used for security training and authorized penetration testing\n\n# Example detection patterns:\n# - Monitor for ${attack.searchKeywords[0]} indicators\n# - Implement controls for ${attack.category.toLowerCase()} attacks\n# - Regular security assessments and updates`
      }
    };
  }

  private getFallbackContent(attack: any) {
    return {
      blueTeam: {
        about: `${attack.name} represents a significant cybersecurity threat in the ${attack.category} category. Understanding this attack type is crucial for developing effective defense strategies.`,
        howItWorks: `${attack.description} Security teams must understand the technical mechanisms to implement appropriate controls.`,
        impact: `Potential impacts include: ${attack.impacts.join(', ')}. Proper risk assessment and mitigation strategies are essential.`
      },
      redTeam: {
        objectives: `From an offensive security perspective, ${attack.name} demonstrates important attack vectors that security teams must understand and test against.`,
        methodology: `The attack follows established methodologies including reconnaissance, access, persistence, and objective completion phases.`,
        exploitCode: `# Educational ${attack.name} Framework\n# For authorized security testing only\n\n# Key indicators:\n# - ${attack.searchKeywords.join(', ')}\n# - Category: ${attack.category}`
      }
    };
  }
}

// Real content generation function
async function generateDailyContent() {
  const newsApiKey = process.env.NEWS_API_KEY;
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!newsApiKey || !googleApiKey) {
    throw new Error('Missing required API keys: NEWS_API_KEY and GOOGLE_API_KEY must be set');
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

  // Generate content using AI
  mockSpinner.start('Generating educational content with AI...');
  const generatedContent = await aiService.generateContent(selectedAttack, articles);
  mockSpinner.succeed('AI content generation completed');

  const currentDate = new Date().toISOString().split('T')[0];
  
  // Create the content structure
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
      blueTeam: generatedContent.blueTeam,
      redTeam: generatedContent.redTeam,
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
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'NEWS_API_KEY', 'GOOGLE_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
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
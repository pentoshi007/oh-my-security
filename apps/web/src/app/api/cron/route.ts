import { NextRequest } from 'next/server'
import { storeContentInSupabase } from '../../../lib/supabase'

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

// Simple content generation function (will be replaced with your generator)
async function generateDailyContent() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Mock content structure - replace with your actual generator
  return {
    attackType: "Sample Attack",
    date: currentDate,
    metadata: {
      attackId: `attack-${currentDate}`,
      difficulty: "Intermediate",
      category: "Web Security",
      industry: ["Technology"],
      timeline: "1-2 hours",
      impact: "Medium",
      detection: "Log monitoring",
      mitigation: "Security updates"
    },
    blueTeam: {
      overview: "Defense strategies...",
      detection: ["Monitor logs", "Network analysis"],
      response: ["Isolate systems", "Patch vulnerabilities"],
      prevention: ["Regular updates", "Security training"],
      tools: ["SIEM", "IDS/IPS"]
    },
    redTeam: {
      overview: "Attack methodology...",
      attack_steps: ["Reconnaissance", "Exploitation"],
      tools: ["Nmap", "Metasploit"],
      evasion: ["Obfuscation", "Timing attacks"],
      payload_examples: ["example payload"]
    },
    news: []
  };
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (process.env.CRON_SECRET && authHeader !== expectedAuth) {
      console.log('❌ Unauthorized cron attempt');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check required environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
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

    console.log('🚀 Starting daily content generation with Supabase...');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    
    // Generate content
    mockSpinner.start('Generating daily cybersecurity content...');
    const content = await generateDailyContent();
    mockSpinner.succeed(`Generated content for ${content.date}`);
    
    // Store in Supabase
    mockSpinner.start('Storing content in Supabase...');
    await storeContentInSupabase(content);
    mockSpinner.succeed('Content stored successfully in database');
    
    // Also save to filesystem for backup
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      
      const contentDir = path.join(process.cwd(), 'content');
      await fs.mkdir(contentDir, { recursive: true });
      
      const filePath = path.join(contentDir, `${content.date}.json`);
      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
      
      mockSpinner.succeed('Backup saved to filesystem');
    } catch (backupError) {
      mockSpinner.warn('Backup to filesystem failed, but Supabase storage succeeded');
      console.error('Backup error:', backupError);
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ Cron job completed successfully in ${duration}ms`);
    
    return Response.json({ 
      success: true, 
      message: 'Daily content generated and stored in Supabase',
      date: content.date,
      attackType: content.attackType,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      storage: 'Supabase + File Backup'
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
      duration: `${duration}ms`
    }, { status: 500 });
  }
} 
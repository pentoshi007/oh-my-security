import { NextResponse } from 'next/server';
import { generateAndSaveContent } from '@oms/generator/src/contentGenerator.js';

// Enhanced mock Ora instance for serverless environment with better logging
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

export async function GET(request: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('secret');
  const forceDiscovery = searchParams.get('discover') === 'true';

  // Verify cron secret for security
  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    console.log('❌ Unauthorized cron attempt with invalid secret');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Check required environment variables
  const requiredEnvVars = ['NEWS_API_KEY', 'GOOGLE_API_KEY'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    const errorMsg = `Missing required environment variables: ${missingVars.join(', ')}`;
    console.error('❌', errorMsg);
    return new NextResponse(JSON.stringify({ 
      success: false, 
      error: errorMsg,
      missingVariables: missingVars 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('🚀 Cron job started: Generating daily cybersecurity content...');
    console.log(`📅 Timestamp: ${new Date().toISOString()}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'unknown'}`);
    console.log(`🔍 Force discovery: ${forceDiscovery ? 'enabled' : 'disabled'}`);
    
    // Set environment variable for force discovery if requested
    if (forceDiscovery) {
      process.env.FORCE_ATTACK_DISCOVERY = 'true';
    }

    await generateAndSaveContent(mockSpinner as any);
    
    const duration = Date.now() - startTime;
    console.log(`✅ Cron job completed successfully in ${duration}ms`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Daily cybersecurity content generated successfully.',
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      environment: process.env.NODE_ENV || 'unknown'
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Cron job failed after', duration, 'ms:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // Log the error stack trace on the server for debugging
    if (error instanceof Error && error.stack) {
      console.error('❌ Error stack trace:', error.stack);
    }
    
    return new NextResponse(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Clean up environment variables
    delete process.env.FORCE_ATTACK_DISCOVERY;
  }
} 
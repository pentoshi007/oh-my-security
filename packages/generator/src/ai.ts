import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { AttackType, BlueTeamContent, RedTeamContent } from './types.js';

export class AIContentGenerator {
  private genAI: GoogleGenerativeAI;
  private model = 'gemini-2.5-flash'; // Fast and powerful model suitable for daily generation

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generate blue team (defensive) content
   */
  async generateBlueTeamContent(attackType: AttackType, articleSummary: string): Promise<BlueTeamContent> {
    const prompt = `You are a senior cybersecurity analyst writing educational content for 'Oh-My-Security'.
Analyze the attack type "${attackType}" with the following news context: "${articleSummary}".
Produce a detailed, structured analysis.

Format your response exactly as follows, with each section being at least 200 words:

ABOUT SECTION:
[Detailed explanation of what the attack is, its importance, threat landscape, and economic impact.]

HOW IT WORKS SECTION:
Provide a detailed technical breakdown with these sub-headings:
Attack Methodology:
1. Initial Access Phase
[Explanation]
2. Persistence and Escalation Phase  
[Explanation]
3. Lateral Movement Phase
[Explanation]
4. Objective Execution Phase
[Explanation]
5. Cleanup and Evasion Phase
[Explanation]

IMPACT SECTION:
Provide a detailed impact analysis with these sub-headings:
Financial Consequences:
[Explanation]
Operational Impact:
[Explanation]
Strategic and Reputational Damage:
[Explanation]`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Blue Team Success (Google Gemini)');
      return this.parseBlueTeamContent(content, attackType);
    } catch (error) {
      console.log('❌ AI Blue Team Error (Google Gemini):', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackBlueTeamContent(attackType);
    }
  }

  /**
   * Generate red team (offensive) content
   */
  async generateRedTeamContent(attackType: AttackType, articleSummary: string): Promise<RedTeamContent> {
    const prompt = `You are a senior red team operator writing educational content for 'Oh-My-Security'.
Analyze offensive techniques for the attack type "${attackType}" using the news context: "${articleSummary}".
Produce a detailed, structured analysis.

Format your response exactly as follows, with each section being at least 200 words:

OBJECTIVES SECTION:
Detail the strategic goals attackers achieve with this attack, covering primary and secondary objectives.

METHODOLOGY SECTION:
Provide a detailed, multi-phase attack methodology from reconnaissance to cleanup.

EXPLOIT CODE SECTION:
Provide educational, functional code examples for demonstrating the attack. Include comments explaining the code. For example:
# ${attackType} Educational Simulation Framework
# WARNING: For authorized educational and testing purposes only
[Provide detailed, working code examples with comments]`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Red Team Success (Google Gemini)');
      return this.parseRedTeamContent(content, attackType);
    } catch (error) {
      console.log('❌ AI Red Team Error (Google Gemini):', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackRedTeamContent(attackType);
    }
  }

  /**
   * Call Google Gemini API
   */
  private async generateContent(prompt: string): Promise<string> {
    try {
      const generationConfig = {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 8192,
      };

      const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ];
      
      const model = this.genAI.getGenerativeModel({ model: this.model });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      if (!response || !response.text()) {
        throw new Error('AI generation failed: No response text from Gemini.');
      }
      return response.text();
    } catch (error) {
      throw new Error(`Google Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse AI-generated content for blue team sections
   */
  private parseBlueTeamContent(content: string, attackType: AttackType): BlueTeamContent {
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
    
    const aboutSection = extractSection(content, 'ABOUT', ['HOW IT WORKS', 'METHODOLOGY', 'IMPACT']) || extractSection(content, 'About:', ['How it works:', 'Impact:']) || content.split(/(?:How it works|Impact)/i)[0];
    const howItWorksSection = extractSection(content, 'HOW IT WORKS', ['IMPACT', 'CONCLUSION']) || extractSection(content, 'How it works:', ['Impact:']) || content.split(/How it works/i)[1]?.split(/Impact/i)[0] || '';
    const impactSection = extractSection(content, 'IMPACT', ['CONCLUSION', 'SUMMARY']) || extractSection(content, 'Impact:', []) || content.split(/Impact/i)[1] || '';
    
    return {
      about: cleanAndFormat(aboutSection) || this.getFallbackBlueTeamContent(attackType).about,
      howItWorks: cleanAndFormat(howItWorksSection) || this.getFallbackBlueTeamContent(attackType).howItWorks,
      impact: cleanAndFormat(impactSection) || this.getFallbackBlueTeamContent(attackType).impact,
    };
  }

  /**
   * Parse AI-generated content for red team sections
   */
  private parseRedTeamContent(content: string, attackType: AttackType): RedTeamContent {
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
    
    const objectivesSection = extractSection(content, 'OBJECTIVES', ['METHODOLOGY', 'EXPLOIT']) || extractSection(content, 'Objectives:', ['Methodology:', 'Exploit']) || content.split(/(?:Methodology|Exploit)/i)[0];
    const methodologySection = extractSection(content, 'METHODOLOGY', ['EXPLOIT', 'CODE']) || extractSection(content, 'Methodology:', ['Exploit:', 'Code:']) || content.split(/Methodology/i)[1]?.split(/(?:Exploit|Code)/i)[0] || '';
    const exploitSection = extractSection(content, 'EXPLOIT', ['CONCLUSION', 'SUMMARY']) || extractSection(content, 'Exploit Code:', []) || extractSection(content, 'Code:', []) || content.split(/(?:Exploit|Code)/i)[1] || '';
    
    return {
      objectives: cleanAndFormat(objectivesSection) || this.getFallbackRedTeamContent(attackType).objectives,
      methodology: cleanAndFormat(methodologySection) || this.getFallbackRedTeamContent(attackType).methodology,
      exploitCode: cleanAndFormat(exploitSection) || this.getFallbackRedTeamContent(attackType).exploitCode,
    };
  }

  /**
   * Fallback blue team content when AI generation fails
   */
  private getFallbackBlueTeamContent(attackType: AttackType): BlueTeamContent {
    const fallbacks: Record<string, BlueTeamContent> = {
      'Ransomware': {
        about: `Ransomware is malicious software that encrypts files, demanding a ransom for decryption. It's a major threat, with organized groups using advanced techniques to target all sectors, causing significant financial and operational damage.`,
        howItWorks: `Attacks often begin with phishing or exploiting vulnerabilities. Once inside, attackers escalate privileges, move laterally to find critical assets, exfiltrate sensitive data for double extortion, and then deploy the ransomware to encrypt files and systems.`,
        impact: `The impact includes direct ransom costs, business downtime, recovery expenses, regulatory fines, and long-term reputational damage. Critical infrastructure is a prime target, where attacks can disrupt essential services.`
      },
      'Data Breach': {
        about: `A data breach is the unauthorized access and disclosure of sensitive or confidential data. Attackers use sophisticated methods, and breaches can go undetected for months, leading to high costs and severe regulatory penalties under laws like GDPR and HIPAA.`,
        howItWorks: `Breaches occur through network intrusion, social engineering, insider threats, or exploiting cloud vulnerabilities. Attackers gain access, escalate privileges, and exfiltrate data over long periods to avoid detection.`,
        impact: `Consequences include heavy regulatory fines, legal fees from class-action lawsuits, financial losses from fraud, and significant damage to customer trust and brand reputation, which can take years to rebuild.`
      },
    };

    return fallbacks[attackType] || {
      about: `${attackType} represents a significant cybersecurity threat that organizations must understand and actively defend against through comprehensive security programs.`,
      howItWorks: `${attackType} attacks typically exploit vulnerabilities in systems, applications, or human behavior to gain unauthorized access, steal data, or disrupt operations.`,
      impact: `${attackType} incidents can result in substantial financial losses, regulatory penalties, operational disruption, data compromise, and long-term reputational damage.`,
    };
  }

  /**
   * Fallback red team content when AI generation fails
   */
  private getFallbackRedTeamContent(attackType: AttackType): RedTeamContent {
    const fallbacks: Record<string, RedTeamContent> = {
      'Ransomware': {
        objectives: `The primary objective is financial extortion through ransom payments. This is often coupled with double extortion, where attackers also steal sensitive data and threaten to leak it to increase pressure on the victim.`,
        methodology: `Attackers gain initial access via phishing or exploiting vulnerabilities. They then conduct reconnaissance, escalate privileges, move laterally across the network to find critical systems and backups, exfiltrate data, and finally deploy the ransomware.`,
        exploitCode: `# EDUCATIONAL RANSOMWARE SIMULATION\n\n# This is a placeholder for educational exploit code. In a real scenario, this section would contain commented code demonstrating encryption and other ransomware techniques for training purposes.`
      },
      'Data Breach': {
        objectives: `Objectives include financial gain from stolen data (e.g., credit cards), intellectual property theft for corporate espionage, and harvesting personal data for identity theft or sale on the dark web.`,
        methodology: `The attack involves reconnaissance to find targets, exploiting vulnerabilities for initial access, establishing persistence, moving laterally to discover and collect sensitive data, and finally exfiltrating the data covertly.`,
        exploitCode: `# EDUCATIONAL DATA BREACH SIMULATION\n\n# This is a placeholder for educational exploit code. This section would demonstrate techniques for data discovery and exfiltration in a controlled, educational environment.`
      },
    };
    
    return fallbacks[attackType] || {
      objectives: `The objectives of a ${attackType} attack are varied, but often include financial gain, data theft, or operational disruption.`,
      methodology: `The methodology of a ${attackType} attack involves several phases, starting with reconnaissance and ending with the attacker achieving their objective.`,
      exploitCode: `// No exploit code available for this fallback.`,
    };
  }
} 
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { AttackType, BlueTeamContent, RedTeamContent } from './types.js';

export class AIContentGenerator {
  private genAI: GoogleGenerativeAI;
  private model = 'gemini-2.5-flash';

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateBlueTeamContent(attackType: AttackType, articleSummary: string): Promise<BlueTeamContent> {
    const prompt = `You are a senior cybersecurity analyst writing educational content for 'Oh-My-Security'.
Your task is to generate a detailed, structured, and professional analysis for the attack type: "${attackType}".
Use the following news context: "${articleSummary}".

IMPORTANT:
- Your response must begin DIRECTLY with "ABOUT SECTION:". Do not add any preamble.
- Follow the specified format exactly. Do not add extra markdown like asterisks to the section titles.

Format:

ABOUT SECTION:
[Detailed explanation of what the attack is, its importance, threat landscape, and economic impact. Minimum 200 words.]

HOW IT WORKS SECTION:
Provide a detailed technical breakdown of how the attack works, including phases like initial access, persistence, lateral movement, objective execution, and cleanup. Use numbered lists or clear paragraphs.

IMPACT SECTION:
Provide a detailed impact analysis, covering financial, operational, and strategic/reputational consequences.`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Blue Team Success (Google Gemini)');
      return this.parseBlueTeamContent(content, attackType);
    } catch (error) {
      console.log('❌ AI Blue Team Error (Google Gemini):', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackBlueTeamContent(attackType);
    }
  }

  async generateRedTeamContent(attackType: AttackType, articleSummary: string): Promise<RedTeamContent> {
    const prompt = `You are a senior red team operator writing educational content for 'Oh-My-Security'.
Your task is to generate a detailed, structured, and professional analysis of offensive techniques for the attack type: "${attackType}".
Use the following news context: "${articleSummary}".

IMPORTANT:
- Your response must begin DIRECTLY with "OBJECTIVES SECTION:". Do not add any preamble.
- Follow the specified format exactly. Do not add extra markdown like asterisks to the section titles.
- For the EXPLOIT CODE SECTION, provide functional, commented, educational code examples.

Format:

OBJECTIVES SECTION:
[Detailed explanation of strategic goals. Minimum 200 words.]

METHODOLOGY SECTION:
[Provide a detailed, multi-phase attack methodology from reconnaissance to cleanup, focusing on offensive techniques.]

EXPLOIT CODE SECTION:
[Provide educational, functional code examples for demonstrating the attack, with comments. For example:
# ${attackType} Educational Simulation Framework
# WARNING: For authorized educational and testing purposes only
...
]`;

    try {
      const content = await this.generateContent(prompt);
      console.log('✅ AI Red Team Success (Google Gemini)');
      return this.parseRedTeamContent(content, attackType);
    } catch (error) {
      console.log('❌ AI Red Team Error (Google Gemini):', error instanceof Error ? error.message : 'Unknown error');
      return this.getFallbackRedTeamContent(attackType);
    }
  }

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
    
    const aboutSection = extractSection(content, 'ABOUT SECTION:', ['HOW IT WORKS SECTION:']);
    const howItWorksSection = extractSection(content, 'HOW IT WORKS SECTION:', ['IMPACT SECTION:']);
    const impactSection = extractSection(content, 'IMPACT SECTION:', []);
    
    return {
      about: cleanAndFormat(aboutSection) || this.getFallbackBlueTeamContent(attackType).about,
      howItWorks: cleanAndFormat(howItWorksSection) || this.getFallbackBlueTeamContent(attackType).howItWorks,
      impact: cleanAndFormat(impactSection) || this.getFallbackBlueTeamContent(attackType).impact,
    };
  }

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
    
    const objectivesSection = extractSection(content, 'OBJECTIVES SECTION:', ['METHODOLOGY SECTION:']);
    const methodologySection = extractSection(content, 'METHODOLOGY SECTION:', ['EXPLOIT CODE SECTION:']);
    const exploitSection = extractSection(content, 'EXPLOIT CODE SECTION:', []);
    
    return {
      objectives: cleanAndFormat(objectivesSection) || this.getFallbackRedTeamContent(attackType).objectives,
      methodology: cleanAndFormat(methodologySection) || this.getFallbackRedTeamContent(attackType).methodology,
      exploitCode: cleanAndFormat(exploitSection) || this.getFallbackRedTeamContent(attackType).exploitCode,
    };
  }

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
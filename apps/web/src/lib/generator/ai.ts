import type { AttackMethodology } from './attackDatabase';

export interface BlueTeamContent {
    about: string;
    howItWorks: string;
    impact: string;
}

export interface RedTeamContent {
    objectives: string;
    methodology: string;
    exploitCode: string;
}

export interface NewsAPIArticle {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
}

export class AIContentGenerator {
    private apiKey: string;
    private model = 'z-ai/glm-4.5-air:free';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async generateBlueTeamContent(attack: AttackMethodology, newsArticles: NewsAPIArticle[]): Promise<BlueTeamContent> {
        // Create a news context summary from the articles
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

    async generateRedTeamContent(attack: AttackMethodology, newsArticles: NewsAPIArticle[]): Promise<RedTeamContent> {
        // Create a news context summary from the articles
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

    /**
     * Create a news context summary from articles
     */
    private createNewsContext(articles: NewsAPIArticle[]): string {
        if (articles.length === 0) {
            return 'No recent news articles found for this attack type.';
        }

        // Take top 3 most relevant articles
        const topArticles = articles.slice(0, 3);

        return topArticles.map((article, index) => {
            const date = new Date(article.publishedAt).toLocaleDateString();
            return `${index + 1}. "${article.title}" - ${article.source.name} (${date})
   Summary: ${article.description}`;
        }).join('\n\n');
    }

    private async generateContent(prompt: string): Promise<string> {
        try {
            console.log('🔄 [AI] Calling OpenRouter API...');

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://oh-my-security.vercel.app',
                    'X-Title': 'Oh-My-Security',
                },
                body: JSON.stringify({
                    model: this.model,
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

            console.log('📊 [AI] finish_reason:', finishReason, '| content length:', generatedText?.length || 0);

            if (!generatedText) {
                throw new Error('AI generation failed: No response text from OpenRouter.');
            }

            return generatedText;
        } catch (error) {
            console.error('❌ [AI] generateContent error:', error instanceof Error ? error.message : 'Unknown error');
            throw new Error(`OpenRouter API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private extractSection(text: string, startMarker: string, endMarkers: string[]): string {
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

    private splitByHeadingsOrProportionally(content: string, numSections: number): string[] {
        const headingPattern = /^#{1,3}\s+.+$/gm;
        const headings: { index: number; match: string }[] = [];
        let match;
        while ((match = headingPattern.exec(content)) !== null) {
            headings.push({ index: match.index, match: match[0] });
        }

        if (headings.length >= numSections) {
            const sections: string[] = [];
            for (let i = 0; i < numSections; i++) {
                const start = headings[i].index;
                if (i === numSections - 1) {
                    sections.push(content.substring(start).trim());
                } else {
                    const end = headings[i + 1].index;
                    sections.push(content.substring(start, end).trim());
                }
            }
            return sections;
        }

        const chunkSize = Math.floor(content.length / numSections);
        const sections: string[] = [];
        for (let i = 0; i < numSections; i++) {
            const start = i * chunkSize;
            const end = i === numSections - 1 ? content.length : (i + 1) * chunkSize;
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

    private parseBlueTeamContent(content: string, attackType: string): BlueTeamContent {
        console.log('🔍 [Parse] Parsing Blue Team content — length:', content.length);

        let aboutSection = this.extractSection(content, 'ABOUT SECTION:', ['HOW IT WORKS SECTION:', 'IMPACT SECTION:']);
        let howItWorksSection = this.extractSection(content, 'HOW IT WORKS SECTION:', ['IMPACT SECTION:']);
        let impactSection = this.extractSection(content, 'IMPACT SECTION:', []);

        if (!aboutSection && !howItWorksSection && !impactSection && content.length > 200) {
            console.log('⚠️ [Parse] No markers found — attempting heading-based split');
            const sections = this.splitByHeadingsOrProportionally(content, 3);
            aboutSection = sections[0] || '';
            howItWorksSection = sections[1] || '';
            impactSection = sections[2] || '';
        }

        return {
            about: this.cleanAndFormatMarkdown(aboutSection) || this.getFallbackBlueTeamContent(attackType).about,
            howItWorks: this.cleanAndFormatMarkdown(howItWorksSection) || this.getFallbackBlueTeamContent(attackType).howItWorks,
            impact: this.cleanAndFormatMarkdown(impactSection) || this.getFallbackBlueTeamContent(attackType).impact,
        };
    }

    private parseRedTeamContent(content: string, attackType: string): RedTeamContent {
        console.log('🔍 [Parse] Parsing Red Team content — length:', content.length);

        let objectivesSection = this.extractSection(content, 'OBJECTIVES SECTION:', ['METHODOLOGY SECTION:', 'EXPLOIT CODE SECTION:']);
        let methodologySection = this.extractSection(content, 'METHODOLOGY SECTION:', ['EXPLOIT CODE SECTION:']);
        let exploitSection = this.extractSection(content, 'EXPLOIT CODE SECTION:', []);

        if (!objectivesSection && !methodologySection && !exploitSection && content.length > 200) {
            console.log('⚠️ [Parse] No markers found — attempting heading-based split');
            const sections = this.splitByHeadingsOrProportionally(content, 3);
            objectivesSection = sections[0] || '';
            methodologySection = sections[1] || '';
            exploitSection = sections[2] || '';
        }

        return {
            objectives: this.cleanAndFormatMarkdown(objectivesSection) || this.getFallbackRedTeamContent(attackType).objectives,
            methodology: this.cleanAndFormatMarkdown(methodologySection) || this.getFallbackRedTeamContent(attackType).methodology,
            exploitCode: this.cleanExploitCode(exploitSection) || this.getFallbackRedTeamContent(attackType).exploitCode,
        };
    }

    /**
     * Clean and format markdown content for proper rendering.
     * Ensures consistent heading hierarchy, proper spacing, and well-structured lists.
     */
    private cleanAndFormatMarkdown(text: string): string {
        if (!text) return '';

        let formatted = text;

        // Remove any stray section markers that leaked through
        formatted = formatted.replace(/^(ABOUT|HOW IT WORKS|IMPACT|OBJECTIVES|METHODOLOGY|EXPLOIT CODE)\s*SECTION:\s*/gim, '');

        // Normalize heading levels: ensure ### is the top-level within sections (no # or ##)
        formatted = formatted.replace(/^#{1,2}\s+/gm, '### ');

        // Ensure blank line before headings (prevents headings appearing mid-paragraph)
        formatted = formatted.replace(/([^\n])\n(###\s)/g, '$1\n\n$2');

        // Ensure blank line after headings
        formatted = formatted.replace(/(###\s.+)\n([^\n#])/g, '$1\n\n$2');

        // Normalize bullet points: convert •, *, + to standard markdown -
        formatted = formatted.replace(/^\s*[•*+]\s+/gm, '- ');

        // Ensure blank line before a list block starts (but not between list items)
        formatted = formatted.replace(/([^\n-])\n(- )/g, '$1\n\n$2');

        // Ensure blank line after a list block ends
        formatted = formatted.replace(/(- .+)\n([^\n-])/g, '$1\n\n$2');

        // Normalize numbered lists: ensure proper formatting
        formatted = formatted.replace(/^\s*(\d+)\)\s+/gm, '$1. ');

        // Collapse 3+ consecutive blank lines into 2
        formatted = formatted.replace(/\n{3,}/g, '\n\n');

        // Remove leading/trailing whitespace on each line (preserve list indentation)
        formatted = formatted.replace(/^[ \t]+(?![-\d])/gm, '');

        // Clean up any trailing whitespace
        formatted = formatted.trim();

        return formatted;
    }

    /**
     * Clean exploit code section — strip markdown fences and normalize formatting.
     */
    private cleanExploitCode(text: string): string {
        if (!text) return '';

        let code = text;

        // Remove markdown code fences (```python, ```bash, ```, etc.)
        code = code.replace(/^```[\w]*\s*$/gm, '');

        // Remove trailing code fence
        code = code.replace(/\n```\s*$/g, '');

        // Collapse excessive blank lines
        code = code.replace(/\n{3,}/g, '\n\n');

        return code.trim();
    }

    private getFallbackBlueTeamContent(attackType: string): BlueTeamContent {
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

    private getFallbackRedTeamContent(attackType: string): RedTeamContent {
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
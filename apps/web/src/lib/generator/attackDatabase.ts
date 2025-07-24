export interface AttackMethodology {
    id: string;
    name: string;
    category: string;
    description: string;
    searchKeywords: string[];
    aliases: string[];
    difficulty: 'Low' | 'Medium' | 'High';
    impacts: string[];
}

export const ATTACK_DATABASE: AttackMethodology[] = [
    // Network Attacks
    {
        id: 'ddos',
        name: 'Distributed Denial of Service (DDoS)',
        category: 'Network Attacks',
        description: 'Overwhelming a system with traffic to make it unavailable',
        searchKeywords: ['DDoS attack', 'denial of service', 'botnet attack', 'traffic flood'],
        aliases: ['DoS', 'Distributed DoS'],
        difficulty: 'Medium',
        impacts: ['Service Disruption', 'Financial Loss', 'Reputation Damage']
    },
    {
        id: 'mitm',
        name: 'Man-in-the-Middle Attack',
        category: 'Network Attacks',
        description: 'Intercepting communication between two parties',
        searchKeywords: ['man-in-the-middle', 'MITM attack', 'intercept communication', 'eavesdropping'],
        aliases: ['MitM', 'Man-in-the-Browser'],
        difficulty: 'High',
        impacts: ['Data Theft', 'Privacy Violation', 'Session Hijacking']
    },
    {
        id: 'dns-poisoning',
        name: 'DNS Poisoning/Spoofing',
        category: 'Network Attacks',
        description: 'Corrupting DNS server data to redirect traffic',
        searchKeywords: ['DNS poisoning', 'DNS spoofing', 'DNS cache poisoning', 'DNS hijacking'],
        aliases: ['DNS Cache Poisoning'],
        difficulty: 'High',
        impacts: ['Traffic Redirection', 'Phishing', 'Malware Distribution']
    },
    {
        id: 'arp-spoofing',
        name: 'ARP Spoofing',
        category: 'Network Attacks',
        description: 'Sending fake ARP messages to redirect network traffic',
        searchKeywords: ['ARP spoofing', 'ARP poisoning', 'ARP attack'],
        aliases: ['ARP Cache Poisoning'],
        difficulty: 'Medium',
        impacts: ['Network Sniffing', 'Session Hijacking', 'DoS']
    },

    // Web Application Attacks
    {
        id: 'sql-injection',
        name: 'SQL Injection',
        category: 'Web Application Attacks',
        description: 'Injecting malicious SQL code into application queries',
        searchKeywords: ['SQL injection', 'SQLi attack', 'database breach SQL', 'SQL vulnerability'],
        aliases: ['SQLi', 'Database Injection'],
        difficulty: 'Medium',
        impacts: ['Data Breach', 'Data Manipulation', 'System Compromise']
    },
    {
        id: 'xss',
        name: 'Cross-Site Scripting (XSS)',
        category: 'Web Application Attacks',
        description: 'Injecting malicious scripts into web pages viewed by other users',
        searchKeywords: ['XSS attack', 'cross-site scripting', 'JavaScript injection', 'script injection'],
        aliases: ['Cross Site Scripting'],
        difficulty: 'Low',
        impacts: ['Session Theft', 'Defacement', 'Phishing']
    },
    {
        id: 'csrf',
        name: 'Cross-Site Request Forgery (CSRF)',
        category: 'Web Application Attacks',
        description: 'Forcing users to execute unwanted actions on a web application',
        searchKeywords: ['CSRF attack', 'cross-site request forgery', 'session riding'],
        aliases: ['XSRF', 'Sea Surf'],
        difficulty: 'Medium',
        impacts: ['Unauthorized Actions', 'Data Modification', 'Account Takeover']
    },
    {
        id: 'xxe',
        name: 'XML External Entity (XXE)',
        category: 'Web Application Attacks',
        description: 'Exploiting XML processors to access files or execute requests',
        searchKeywords: ['XXE attack', 'XML external entity', 'XML injection', 'XML vulnerability'],
        aliases: ['XML Injection'],
        difficulty: 'High',
        impacts: ['File Disclosure', 'SSRF', 'DoS']
    },
    {
        id: 'ssrf',
        name: 'Server-Side Request Forgery (SSRF)',
        category: 'Web Application Attacks',
        description: 'Forcing server to make requests to unintended locations',
        searchKeywords: ['SSRF attack', 'server-side request forgery', 'internal network access'],
        aliases: ['Server Request Forgery'],
        difficulty: 'High',
        impacts: ['Internal Network Access', 'Data Exfiltration', 'Cloud Metadata Theft']
    },
    {
        id: 'command-injection',
        name: 'Command Injection',
        category: 'Web Application Attacks',
        description: 'Executing arbitrary commands on the host operating system',
        searchKeywords: ['command injection', 'OS command injection', 'shell injection', 'code execution'],
        aliases: ['OS Command Injection', 'Shell Injection'],
        difficulty: 'High',
        impacts: ['System Compromise', 'Data Theft', 'Service Disruption']
    },

    // Malware & Social Engineering
    {
        id: 'ransomware',
        name: 'Ransomware',
        category: 'Malware',
        description: 'Encrypting victim data and demanding ransom for decryption',
        searchKeywords: ['ransomware attack', 'crypto ransomware', 'file encryption', 'ransom demand'],
        aliases: ['Crypto-malware', 'Cryptolocker'],
        difficulty: 'High',
        impacts: ['Data Loss', 'Financial Loss', 'Business Disruption']
    },
    {
        id: 'phishing',
        name: 'Phishing',
        category: 'Social Engineering',
        description: 'Deceiving users to reveal sensitive information',
        searchKeywords: ['phishing attack', 'phishing email', 'spear phishing', 'email scam'],
        aliases: ['Spear Phishing', 'Whaling'],
        difficulty: 'Low',
        impacts: ['Credential Theft', 'Financial Fraud', 'Malware Installation']
    },
    {
        id: 'trojan',
        name: 'Trojan Horse',
        category: 'Malware',
        description: 'Malware disguised as legitimate software',
        searchKeywords: ['trojan malware', 'trojan horse', 'backdoor trojan', 'remote access trojan'],
        aliases: ['RAT', 'Backdoor'],
        difficulty: 'Medium',
        impacts: ['System Control', 'Data Theft', 'Botnet Recruitment']
    },
    {
        id: 'keylogger',
        name: 'Keylogger',
        category: 'Malware',
        description: 'Recording keystrokes to steal sensitive information',
        searchKeywords: ['keylogger malware', 'keystroke logger', 'keyboard capture'],
        aliases: ['Keystroke Logger'],
        difficulty: 'Low',
        impacts: ['Credential Theft', 'Privacy Violation', 'Data Theft']
    },
    {
        id: 'spyware',
        name: 'Spyware',
        category: 'Malware',
        description: 'Software that secretly monitors user activity',
        searchKeywords: ['spyware attack', 'surveillance malware', 'monitoring software'],
        aliases: ['Surveillance Software'],
        difficulty: 'Medium',
        impacts: ['Privacy Violation', 'Data Theft', 'System Performance']
    },

    // Authentication & Access Attacks
    {
        id: 'brute-force',
        name: 'Brute Force Attack',
        category: 'Authentication Attacks',
        description: 'Systematically trying all possible passwords',
        searchKeywords: ['brute force attack', 'password cracking', 'credential stuffing', 'dictionary attack'],
        aliases: ['Password Attack', 'Dictionary Attack'],
        difficulty: 'Low',
        impacts: ['Account Compromise', 'Unauthorized Access', 'Data Breach']
    },
    {
        id: 'privilege-escalation',
        name: 'Privilege Escalation',
        category: 'Access Control Attacks',
        description: 'Gaining elevated access to resources',
        searchKeywords: ['privilege escalation', 'admin access', 'root access', 'elevation of privilege'],
        aliases: ['Vertical Privilege Escalation', 'Horizontal Privilege Escalation'],
        difficulty: 'High',
        impacts: ['System Compromise', 'Data Access', 'Persistence']
    },
    {
        id: 'session-hijacking',
        name: 'Session Hijacking',
        category: 'Authentication Attacks',
        description: 'Taking over a user session to gain unauthorized access',
        searchKeywords: ['session hijacking', 'session theft', 'cookie hijacking', 'session fixation'],
        aliases: ['Cookie Hijacking', 'Session Fixation'],
        difficulty: 'Medium',
        impacts: ['Account Takeover', 'Identity Theft', 'Unauthorized Actions']
    },
    {
        id: 'password-spraying',
        name: 'Password Spraying',
        category: 'Authentication Attacks',
        description: 'Trying common passwords across many accounts',
        searchKeywords: ['password spraying', 'credential spraying', 'low and slow attack'],
        aliases: ['Credential Spraying'],
        difficulty: 'Low',
        impacts: ['Account Compromise', 'Mass Breach', 'Lateral Movement']
    },

    // Advanced Persistent Threats
    {
        id: 'apt',
        name: 'Advanced Persistent Threat (APT)',
        category: 'Advanced Attacks',
        description: 'Long-term targeted attack by sophisticated threat actors',
        searchKeywords: ['APT attack', 'advanced persistent threat', 'nation state attack', 'targeted attack'],
        aliases: ['Nation-State Attack'],
        difficulty: 'High',
        impacts: ['Long-term Compromise', 'Espionage', 'Data Exfiltration']
    },
    {
        id: 'zero-day',
        name: 'Zero-Day Exploit',
        category: 'Advanced Attacks',
        description: 'Exploiting unknown vulnerabilities',
        searchKeywords: ['zero-day exploit', 'zero day attack', '0day vulnerability', 'unknown vulnerability'],
        aliases: ['0-day', 'Zero Day'],
        difficulty: 'High',
        impacts: ['Unpatched Vulnerability', 'System Compromise', 'Wide Impact']
    },
    {
        id: 'supply-chain',
        name: 'Supply Chain Attack',
        category: 'Advanced Attacks',
        description: 'Targeting less-secure elements in the supply network',
        searchKeywords: ['supply chain attack', 'third party breach', 'vendor compromise', 'software supply chain'],
        aliases: ['Third-Party Attack', 'Vendor Attack'],
        difficulty: 'High',
        impacts: ['Widespread Compromise', 'Trust Exploitation', 'Multiple Victims']
    },

    // Data-Specific Attacks
    {
        id: 'data-breach',
        name: 'Data Breach',
        category: 'Data Attacks',
        description: 'Unauthorized access and theft of sensitive data',
        searchKeywords: ['data breach', 'data theft', 'information leak', 'database breach'],
        aliases: ['Data Leak', 'Information Breach'],
        difficulty: 'Medium',
        impacts: ['Privacy Violation', 'Regulatory Fines', 'Reputation Damage']
    },
    {
        id: 'data-exfiltration',
        name: 'Data Exfiltration',
        category: 'Data Attacks',
        description: 'Unauthorized transfer of data from a system',
        searchKeywords: ['data exfiltration', 'data theft', 'information stealing', 'data smuggling'],
        aliases: ['Data Theft', 'Information Exfiltration'],
        difficulty: 'Medium',
        impacts: ['Intellectual Property Theft', 'Competitive Disadvantage', 'Privacy Violation']
    },

    // Physical & IoT Attacks
    {
        id: 'evil-twin',
        name: 'Evil Twin Attack',
        category: 'Wireless Attacks',
        description: 'Creating fake WiFi access points to steal data',
        searchKeywords: ['evil twin attack', 'rogue access point', 'fake WiFi', 'WiFi spoofing'],
        aliases: ['Rogue AP', 'WiFi Phishing'],
        difficulty: 'Low',
        impacts: ['Credential Theft', 'Traffic Interception', 'Malware Distribution']
    },
    {
        id: 'iot-botnet',
        name: 'IoT Botnet',
        category: 'IoT Attacks',
        description: 'Compromising IoT devices to create botnets',
        searchKeywords: ['IoT botnet', 'Mirai botnet', 'IoT compromise', 'smart device hack'],
        aliases: ['IoT Malware', 'Smart Device Botnet'],
        difficulty: 'Medium',
        impacts: ['DDoS Capability', 'Privacy Violation', 'Resource Abuse']
    },
    {
        id: 'bluetooth-attack',
        name: 'Bluetooth Attacks',
        category: 'Wireless Attacks',
        description: 'Exploiting Bluetooth vulnerabilities',
        searchKeywords: ['Bluetooth hack', 'BlueBorne', 'Bluetooth vulnerability', 'Bluesnarfing'],
        aliases: ['BlueBorne', 'Bluesnarfing', 'Bluejacking'],
        difficulty: 'Medium',
        impacts: ['Device Access', 'Data Theft', 'Privacy Violation']
    },

    // Crypto & Blockchain Attacks
    {
        id: 'cryptojacking',
        name: 'Cryptojacking',
        category: 'Cryptocurrency Attacks',
        description: 'Unauthorized use of computing resources to mine cryptocurrency',
        searchKeywords: ['cryptojacking', 'crypto mining malware', 'cryptocurrency mining', 'browser mining'],
        aliases: ['Crypto Mining Malware', 'Coinhive'],
        difficulty: 'Low',
        impacts: ['Resource Theft', 'Performance Degradation', 'Energy Costs']
    },
    {
        id: 'wallet-theft',
        name: 'Cryptocurrency Wallet Theft',
        category: 'Cryptocurrency Attacks',
        description: 'Stealing cryptocurrency wallets or private keys',
        searchKeywords: ['crypto wallet theft', 'Bitcoin theft', 'cryptocurrency hack', 'wallet breach'],
        aliases: ['Crypto Theft', 'Wallet Hack'],
        difficulty: 'Medium',
        impacts: ['Financial Loss', 'Irreversible Theft', 'Privacy Violation']
    },

    // Misconfiguration & Human Error
    {
        id: 'misconfig',
        name: 'Security Misconfiguration',
        category: 'Configuration Attacks',
        description: 'Exploiting improperly configured systems',
        searchKeywords: ['security misconfiguration', 'exposed database', 'open S3 bucket', 'default credentials'],
        aliases: ['Config Error', 'Exposed Services'],
        difficulty: 'Low',
        impacts: ['Data Exposure', 'Unauthorized Access', 'System Compromise']
    },
    {
        id: 'insider-threat',
        name: 'Insider Threat',
        category: 'Human Factor',
        description: 'Malicious actions by authorized users',
        searchKeywords: ['insider threat', 'malicious insider', 'employee theft', 'internal threat'],
        aliases: ['Internal Threat', 'Malicious Employee'],
        difficulty: 'Medium',
        impacts: ['Data Theft', 'Sabotage', 'Fraud']
    },
    {
        id: 'social-engineering',
        name: 'Social Engineering',
        category: 'Human Factor',
        description: 'Manipulating people to divulge confidential information',
        searchKeywords: ['social engineering', 'human hacking', 'pretexting', 'baiting'],
        aliases: ['Human Hacking', 'Psychological Manipulation'],
        difficulty: 'Low',
        impacts: ['Information Disclosure', 'Unauthorized Access', 'Financial Loss']
    }
];

// Helper function to get all unique attack categories
export function getAttackCategories(): string[] {
    return [...new Set(ATTACK_DATABASE.map(attack => attack.category))];
}

// Helper function to get attacks by category
export function getAttacksByCategory(category: string): AttackMethodology[] {
    return ATTACK_DATABASE.filter(attack => attack.category === category);
}

// Helper function to get attack by ID
export function getAttackById(id: string): AttackMethodology | undefined {
    return ATTACK_DATABASE.find(attack => attack.id === id);
}

// Dynamic attack database that can be updated
let dynamicAttackDatabase = [...ATTACK_DATABASE];

// Get a random attack that hasn't been used recently
export function getNextAttack(recentlyUsedIds: string[]): AttackMethodology {
    const availableAttacks = dynamicAttackDatabase.filter(
        attack => !recentlyUsedIds.includes(attack.id)
    );

    if (availableAttacks.length === 0) {
        // If all attacks have been used, start over
        console.log('🔄 All attacks covered! Starting new cycle...');
        return dynamicAttackDatabase[Math.floor(Math.random() * dynamicAttackDatabase.length)];
    }

    return availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
}

// Search for attacks by keywords
export function searchAttacks(query: string): AttackMethodology[] {
    const lowerQuery = query.toLowerCase();
    return dynamicAttackDatabase.filter(attack =>
        attack.name.toLowerCase().includes(lowerQuery) ||
        attack.description.toLowerCase().includes(lowerQuery) ||
        attack.searchKeywords.some(keyword => keyword.toLowerCase().includes(lowerQuery)) ||
        attack.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
    );
}

// Add new attacks to the database
export function addNewAttack(attack: AttackMethodology): boolean {
    // Check if attack already exists
    const exists = dynamicAttackDatabase.some(existing =>
        existing.id === attack.id ||
        existing.name.toLowerCase() === attack.name.toLowerCase()
    );

    if (!exists) {
        dynamicAttackDatabase.push(attack);
        console.log(`✅ Added new attack: ${attack.name} (${attack.category})`);
        return true;
    }

    return false;
}

// Add multiple new attacks
export function addNewAttacks(attacks: AttackMethodology[]): number {
    let addedCount = 0;
    for (const attack of attacks) {
        if (addNewAttack(attack)) {
            addedCount++;
        }
    }
    return addedCount;
}

// Get current database size
export function getDatabaseSize(): number {
    return dynamicAttackDatabase.length;
}

// Get all attacks (including dynamically added ones)
export function getAllAttacks(): AttackMethodology[] {
    return [...dynamicAttackDatabase];
}

// Reset to original database (for testing)
export function resetToOriginalDatabase(): void {
    dynamicAttackDatabase = [...ATTACK_DATABASE];
}

// Check if we should look for new attacks (when we've covered most existing ones)
export function shouldDiscoverNewAttacks(recentlyUsedIds: string[]): boolean {
    const coverageRatio = recentlyUsedIds.length / dynamicAttackDatabase.length;
    return coverageRatio >= 0.8; // When we've covered 80% of attacks, look for new ones
}
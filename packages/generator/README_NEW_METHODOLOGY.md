# Oh-My-Security Generator - New Methodology-Driven Approach

## Overview

The Oh-My-Security content generation system has been redesigned to follow a **methodology-driven approach** instead of the previous news-driven approach. This ensures:

1. **No duplicate content** - Each day covers a unique attack methodology
2. **Comprehensive coverage** - Systematically covers all known attack types
3. **Real-world context** - Uses current news as examples within educational content
4. **Better organization** - Content is structured by attack methodology, not random news

## How It Works

### 1. Attack Database (`attackDatabase.ts`)

Contains a comprehensive list of 32+ cybersecurity attack methodologies, organized by categories:

- Network Attacks (DDoS, MITM, DNS Poisoning, etc.)
- Web Application Attacks (SQL Injection, XSS, CSRF, etc.)
- Malware (Ransomware, Trojans, Spyware, etc.)
- Social Engineering (Phishing, Social Engineering, etc.)
- Authentication Attacks (Brute Force, Session Hijacking, etc.)
- Advanced Attacks (APT, Zero-Day, Supply Chain, etc.)
- IoT & Wireless Attacks
- Cryptocurrency Attacks
- Configuration & Human Factor

Each attack entry includes:

```typescript
{
  id: string;              // Unique identifier
  name: string;            // Attack name
  category: string;        // Category grouping
  description: string;     // Brief description
  searchKeywords: string[]; // Keywords for news search
  aliases: string[];       // Alternative names
  difficulty: 'Low' | 'Medium' | 'High';
  impacts: string[];       // Potential impacts
}
```

### 2. History Tracker (`historyTracker.ts`)

Manages which attacks have been covered recently:

- Tracks last 30 attack IDs to avoid repetition
- Persists history in `.generation-history.json`
- Tracks total generation count
- Helps ensure comprehensive coverage

### 3. Enhanced News Search (`newsapi.ts`)

The news search is now **targeted** rather than generic:

```typescript
async fetchNewsForAttack(attack: AttackMethodology): Promise<NewsAPIArticle[]>
```

- Searches for news specifically related to the selected attack methodology
- Uses attack keywords, aliases, and search terms
- Scores articles by relevance
- Falls back to general cybersecurity news if no specific articles found

### 4. AI Content Generation (`ai.ts`)

Content generation now incorporates:

- Attack methodology details (description, impacts, difficulty)
- Real news examples as context
- References to actual incidents in the educational content

### 5. Generation Process (`contentGenerator.ts`)

The new generation flow:

1. Load history of previously used attacks
2. Select next attack methodology (avoiding recent ones)
3. Search for news articles about that specific attack
4. Generate educational content using both methodology info and news context
5. Save content with metadata about the attack
6. Update history

## Usage

Run the generator as usual:

```bash
./generate-content.sh
```

Output shows:

- Selected attack methodology
- Category and difficulty
- Number of relevant news articles found
- Generation progress
- Total attacks covered

## Example Output

```
✔ History loaded
✔ Selected: IoT Botnet
📚 Category: IoT Attacks
🎯 Difficulty: Medium
✔ Found 13 relevant articles
📰 Top article: "Daily Tech News 21 June 2025" - Acecomments.mu.nu
✔ Content generated successfully!
📅 2025-06-27 - IoT Botnet
📊 Total attacks covered: 1/32
```

## Benefits

1. **Educational Value**: Each day teaches about a specific attack methodology
2. **Current Context**: Uses real, recent news as examples
3. **No Duplicates**: Won't repeat the same attack type for at least 30 days
4. **Complete Coverage**: Will systematically cover all attack types
5. **Better SEO**: Content is organized by attack methodology keywords

## Future Enhancements

- Add more attack methodologies as new threats emerge
- Implement priority system for trending attacks
- Add seasonal relevance (e.g., tax scams during tax season)
- Create learning paths (beginner → advanced attacks)
- Generate weekly/monthly summary reports

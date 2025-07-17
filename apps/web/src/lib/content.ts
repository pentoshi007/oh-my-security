import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import type { DailyContent } from '@/types/content'
import * as fs from 'fs/promises'

// Correctly locate the content directory from the web app root
const contentDirectory = join(process.cwd(), 'content')

// This function now reads all files from the content directory
export function getAllContent(): DailyContent[] {
  try {
    console.log(`Reading content from: ${contentDirectory}`)
    const fileNames = readdirSync(contentDirectory)
    console.log(`Found files: ${fileNames.join(', ')}`)
    const allContent = fileNames
      .filter(fileName => fileName.endsWith('.json'))
      .map(fileName => {
        try {
        const filePath = join(contentDirectory, fileName)
        const fileContent = readFileSync(filePath, 'utf-8')
          const parsed = JSON.parse(fileContent) as DailyContent
          
          // Validate each content file
          if (!parsed.content || !parsed.content.blueTeam || !parsed.content.redTeam) {
            console.warn(`Invalid content structure in ${fileName}`)
            return null
          }
          
          return parsed
        } catch (fileError) {
          console.error(`Error reading file ${fileName}:`, fileError)
          return null
        }
      })
      .filter((content): content is DailyContent => content !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by most recent
    
    console.log(`Successfully loaded ${allContent.length} content files`)
    return allContent
  } catch (error) {
    console.error(`Could not read content directory at ${contentDirectory}:`, error)
    // Try alternative path from project root
    try {
      const altPath = join(process.cwd(), '..', '..', 'content')
      console.log(`Trying alternative path: ${altPath}`)
      const fileNames = readdirSync(altPath)
      const allContent = fileNames
        .filter(fileName => fileName.endsWith('.json'))
        .map(fileName => {
          try {
          const filePath = join(altPath, fileName)
          const fileContent = readFileSync(filePath, 'utf-8')
            const parsed = JSON.parse(fileContent) as DailyContent
            
            if (!parsed.content || !parsed.content.blueTeam || !parsed.content.redTeam) {
              console.warn(`Invalid content structure in ${fileName}`)
              return null
            }
            
            return parsed
          } catch (fileError) {
            console.error(`Error reading file ${fileName}:`, fileError)
            return null
          }
        })
        .filter((content): content is DailyContent => content !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      console.log(`Successfully loaded ${allContent.length} content files from alternative path`)
      return allContent
    } catch (altError) {
      console.error(`Alternative path also failed:`, altError)
      return []
    }
  }
}

// Gets the most recent content
export function getTodaysContent(): DailyContent {
  try {
  const allContent = getAllContent()
  if (allContent.length > 0) {
      const todaysContent = allContent[0]
      console.log(`Loaded today's content: ${todaysContent.date} - ${todaysContent.attackType}`)
  
      // Validate the content structure
      if (!todaysContent.content || !todaysContent.content.blueTeam || !todaysContent.content.redTeam) {
        console.warn('Content structure is incomplete, using sample content')
  return getSampleContent()
      }
      
      return todaysContent
    }
    
    console.warn('No content files found, using sample content')
    return getSampleContent()
  } catch (error) {
    console.error('Error loading today\'s content:', error)
    return getSampleContent()
  }
}

// Gets content for a specific date
export function getContentByDate(date: string): DailyContent | undefined {
  const allContent = getAllContent()
  return allContent.find(content => content.date === date)
}

export async function getAttackCount(): Promise<number> {
  const possiblePaths = [
    join(process.cwd(), 'packages', 'generator', 'src', 'attackDatabase.ts'),
    join(process.cwd(), '..', '..', 'packages', 'generator', 'src', 'attackDatabase.ts'),
    join(process.cwd(), '..', 'packages', 'generator', 'src', 'attackDatabase.ts')
  ]

  for (const dbPath of possiblePaths) {
    try {
      const fileContent = await fs.readFile(dbPath, 'utf-8')
      const attackCount = (fileContent.match(/id: '/g) || []).length
      if (attackCount > 0) {
        return attackCount
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error('Error reading attack database:', error)
      }
    }
  }
  // fallback value if file not found or empty
  return 32
}

function getSampleContent(): DailyContent {
  return {
    date: "2024-12-26",
    attackType: "SQL Injection",
    article: {
      title: "Major Healthcare Provider Breached via SQL Injection Attack",
      url: "https://example.com/healthcare-breach",
      source: "CyberSecurity News",
      publishedAt: "2024-12-26T08:00:00Z",
      summary: "A prominent healthcare provider experienced a significant data breach affecting over 100,000 patient records when attackers exploited an SQL injection vulnerability in their patient portal system."
    },
    content: {
      blueTeam: {
        about: "SQL Injection is a code injection technique that exploits vulnerabilities in an application's database layer. It occurs when user-supplied input is incorrectly filtered for string literal escape characters embedded in SQL statements or when user input is not strongly typed.",
        howItWorks: "Attackers insert malicious SQL statements into application inputs that are passed to a database for execution. By manipulating SQL queries, attackers can view, insert, modify, or delete data in the database, potentially bypassing authentication and authorization mechanisms.",
        impact: "SQL injection attacks can lead to unauthorized data access, data modification, data deletion, and complete database compromise. In severe cases, attackers may gain administrative access to the database server and potentially the underlying operating system."
      },
      redTeam: {
        objectives: "Extract sensitive data, bypass authentication mechanisms, modify database records, gain administrative access, or use the database server as a pivot point for lateral movement within the network.",
        methodology: "1. Identify input fields and parameters\n2. Test for SQL injection vulnerabilities using manual techniques or automated tools\n3. Craft malicious SQL payloads to extract information\n4. Escalate privileges if possible\n5. Extract sensitive data or maintain persistence",
        exploitCode: "# Basic SQL injection payloads\n' OR '1'='1' --\n' UNION SELECT username, password FROM users --\n'; DROP TABLE users; --\n\n# Time-based blind SQL injection\n' AND (SELECT SLEEP(5)) --\n\n# Boolean-based blind SQL injection\n' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a' --"
      }
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0.0"
    }
  }
} 
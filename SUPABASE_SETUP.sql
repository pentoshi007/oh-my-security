-- Supabase Database Setup for Oh-My-Security
-- Run this SQL in your Supabase SQL Editor

-- Create the daily_content table
CREATE TABLE IF NOT EXISTS daily_content (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  attack_type TEXT NOT NULL,
  content_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_content_date ON daily_content(date);
CREATE INDEX IF NOT EXISTS idx_daily_content_attack_type ON daily_content(attack_type);
CREATE INDEX IF NOT EXISTS idx_daily_content_created_at ON daily_content(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON daily_content
  FOR SELECT TO public
  USING (true);

-- Create policy to allow service role full access
CREATE POLICY "Allow service role full access" ON daily_content
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a view for the archive (optional, for better performance)
CREATE OR REPLACE VIEW content_archive AS
SELECT date, attack_type, created_at
FROM daily_content
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON content_archive TO public;

-- Insert some sample data (optional - remove if not needed)
INSERT INTO daily_content (date, attack_type, content_data) VALUES 
(
  '2025-01-17',
  'SQL Injection',
  '{
    "attackType": "SQL Injection",
    "date": "2025-01-17",
    "metadata": {
      "attackId": "sql-injection-001",
      "difficulty": "Intermediate",
      "category": "Web Application Security",
      "industry": ["Web Development", "E-commerce", "Financial Services"],
      "timeline": "Minutes to Hours",
      "impact": "Data Breach, Data Manipulation",
      "detection": "WAF Logs, Database Monitoring",
      "mitigation": "Input Validation, Prepared Statements"
    },
    "blueTeam": {
      "overview": "SQL injection is one of the most common web application vulnerabilities...",
      "detection": ["Monitor unusual database queries", "Implement WAF rules"],
      "response": ["Isolate affected systems", "Review database logs"],
      "prevention": ["Use parameterized queries", "Input validation"],
      "tools": ["SQLMap detection", "SIEM tools", "Database monitoring"]
    },
    "redTeam": {
      "overview": "SQL injection allows attackers to manipulate database queries...",
      "attack_steps": ["Identify injection points", "Test for vulnerabilities"],
      "tools": ["SQLMap", "Burp Suite", "OWASP ZAP"],
      "evasion": ["Encoding techniques", "Comment-based bypasses"],
      "payload_examples": ["1 OR 1=1", "UNION SELECT"]
    },
    "news": []
  }'
)
ON CONFLICT (date) DO NOTHING;

-- Success message
SELECT 'Supabase setup completed successfully! 🚀' as message; 
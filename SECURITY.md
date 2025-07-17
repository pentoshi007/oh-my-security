# Security Guidelines for Oh-My-Security (OMS)

## 🔒 Overview

This document outlines security best practices and guidelines for the Oh-My-Security project to ensure safe development, deployment, and maintenance.

## 🚨 Critical Security Checklist

### ✅ Environment Variables

- [ ] **NEVER** commit `.env` files to version control
- [ ] All sensitive data (API keys, database credentials) stored in environment variables
- [ ] Use `.env.example` files for documentation (without real values)
- [ ] MongoDB URI credentials are properly externalized
- [ ] API keys are properly managed in deployment environment

### ✅ Database Security

- [ ] MongoDB connection strings do not contain hardcoded credentials
- [ ] Database connections are properly secured with authentication
- [ ] Input validation implemented for all database operations
- [ ] Email validation regex properly protects against injection

### ✅ API Security

- [ ] CRON endpoints protected with secret authentication
- [ ] Rate limiting implemented for subscription endpoints
- [ ] Input sanitization for all user inputs
- [ ] Proper error handling without information leakage

### ✅ Content Security

- [ ] Educational exploit code clearly marked as examples
- [ ] No real malicious code or working exploits included
- [ ] Content generation uses ethical AI practices
- [ ] Source attribution for security research

## 🔐 Environment Configuration

### Required Environment Variables

```bash
# News API (get from https://newsapi.org/register)
NEWS_API_KEY=your_newsapi_key_here

# Google Gemini AI API (get from https://aistudio.google.com/app/apikey)
GOOGLE_API_KEY=your_google_api_key_here

# MongoDB Connection URI (no credentials in code)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=AppName

# Cron job security (generate a random secret)
CRON_SECRET=your_random_secret_here
```

### Deployment Security

1. **Vercel Environment Variables**

   ```bash
   vercel env add NEWS_API_KEY
   vercel env add GOOGLE_API_KEY
   vercel env add MONGODB_URI
   vercel env add CRON_SECRET
   ```

2. **Local Development**
   - Copy `.env.example` to `.env`
   - Fill in your actual values
   - Never commit `.env` to git

## 🛡️ Code Security Practices

### Input Validation

- All email inputs validated with secure regex
- Database queries use parameterized queries
- User inputs sanitized before processing

### Error Handling

- Sensitive information not exposed in error messages
- Graceful fallbacks when services are unavailable
- Proper logging without credential exposure

### Content Generation

- AI-generated content reviewed for accuracy
- Educational focus maintained
- No working malicious code examples

## 🔍 Security Monitoring

### Logging

- API endpoint access logged
- Failed authentication attempts monitored
- Error patterns tracked for security issues

### Regular Audits

- Dependencies regularly updated
- Security patches applied promptly
- Code reviews for security vulnerabilities

## 🚫 What NOT to Include

### ❌ Never Commit These

- `.env` files with real credentials
- API keys or database passwords
- Personal information or real email lists
- Working exploit code or malware samples

### ❌ Content Restrictions

- No real-world vulnerabilities with active exploits
- No personal information in examples
- No copyrighted security research without attribution
- No encouragement of illegal activities

## 🔄 Regular Security Tasks

### Weekly

- [ ] Review generated content for security appropriateness
- [ ] Check for dependency updates
- [ ] Monitor API usage for unusual patterns

### Monthly

- [ ] Audit environment variable usage
- [ ] Review access logs
- [ ] Update security documentation

### Quarterly

- [ ] Full security code review
- [ ] Penetration testing of public endpoints
- [ ] Update security policies

## 📞 Security Incident Response

### If Security Issue Discovered:

1. **Immediate**: Remove sensitive data from public access
2. **Within 1 hour**: Assess impact and containment
3. **Within 24 hours**: Implement fixes and deploy
4. **Within 48 hours**: Document incident and lessons learned

### Contact Information

- Security issues: Create GitHub issue with `security` label
- Critical vulnerabilities: Contact project maintainers directly

## 🏆 Security Best Practices

### Development

- Use principle of least privilege
- Implement defense in depth
- Regular security testing
- Secure coding standards

### Deployment

- HTTPS only for all connections
- Secure headers implemented
- Regular security scans
- Automated vulnerability checks

### Maintenance

- Keep dependencies updated
- Regular security audits
- Monitor for new threats
- Incident response planning

---

**Remember**: Security is everyone's responsibility. When in doubt, err on the side of caution and ask for security review.

Last Updated: $(date)
Generated for Oh-My-Security Project

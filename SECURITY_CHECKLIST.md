# Security Checklist

## 🔴 CRITICAL - DO THIS IMMEDIATELY

### 1. Remove Secrets from Repository
- [ ] **IMMEDIATELY** remove `backend/.env` and `frontend/.env` from git tracking
- [ ] Run: `git rm --cached backend/.env frontend/.env`
- [ ] Run: `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch backend/.env frontend/.env" --prune-empty --tag-name-filter cat -- --all`
- [ ] Force push to remote (coordinate with team): `git push origin --force --all`

### 2. Rotate ALL Credentials
- [ ] Generate new `GEMINI_API_KEY` in Google Cloud Console
- [ ] Reset Supabase database password in Supabase Dashboard > Settings > Database
- [ ] Generate new `SECRET_KEY`: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- [ ] Generate new `JWT_SECRET_KEY`: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- [ ] Regenerate Supabase `ANON_KEY` and `SERVICE_ROLE_KEY` if exposed publicly
- [ ] Update all `.env.example` files to remove any real values

### 3. Update .gitignore
✅ Already updated - `.env` files are now properly ignored

### 4. Set Environment Variables Securely
**Development:**
```bash
# Create backend/.env (never commit this!)
cp backend/.env.example backend/.env
# Edit backend/.env with your actual secrets

# Create frontend/.env (never commit this!)
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your actual secrets
```

**Production:**
- Use environment variables in your hosting platform (Railway, Heroku, AWS, etc.)
- Never store secrets in code or config files
- Use secret management services (AWS Secrets Manager, Azure Key Vault, etc.)

## ⚠️ HIGH PRIORITY - Do This Week

### 5. Implement Enhanced Security
✅ Already implemented:
- Stronger password requirements (12+ chars, complexity)
- Account lockout after 5 failed attempts
- Stricter rate limiting on auth endpoints
- Enhanced input validation and XSS protection
- Database connection timeouts
- Better error handling with proper rollback

### 6. Add CSRF Protection
- [ ] Implement CSRF tokens for all state-changing operations
- [ ] Use `fastapi-csrf-protect` or similar library
- [ ] Add CSRF token to frontend requests

### 7. Implement Request ID Tracing
- [ ] Add UUID to each request for tracking
- [ ] Include request ID in all log messages
- [ ] Return request ID in error responses

### 8. Set Up Proper Logging
- [ ] Configure structured logging with JSON format
- [ ] Set up log aggregation (ELK, Datadog, CloudWatch)
- [ ] Implement log rotation
- [ ] Add sensitive data masking in logs

### 9. Database Security
- [ ] Review and tighten Supabase RLS policies
- [ ] Implement database connection pooling monitoring
- [ ] Set up automated backups
- [ ] Test disaster recovery procedures

### 10. API Security
- [ ] Implement API key rotation strategy
- [ ] Add API versioning deprecation notices
- [ ] Implement request signing for sensitive operations
- [ ] Add webhook signature verification

## 📊 MEDIUM PRIORITY - Do This Month

### 11. Improve Monitoring
- [ ] Set up Sentry for error tracking
- [ ] Configure Prometheus alerts
- [ ] Add custom metrics for business logic
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

### 12. Testing
- [ ] Increase test coverage to >70%
- [ ] Add security-focused tests (SQL injection, XSS, CSRF)
- [ ] Implement integration tests for auth flows
- [ ] Add load testing with realistic scenarios

### 13. Documentation
- [ ] Document authentication flow
- [ ] Create API error code reference
- [ ] Write security incident response plan
- [ ] Document disaster recovery procedures

### 14. Performance
- [ ] Implement response caching strategy
- [ ] Add pagination to all list endpoints
- [ ] Optimize database queries (add missing indexes)
- [ ] Implement circuit breakers for external services

### 15. Compliance
- [ ] Add privacy policy and terms of service
- [ ] Implement GDPR compliance features (data export, deletion)
- [ ] Add consent management
- [ ] Implement audit logging for sensitive operations

## ✅ ONGOING - Best Practices

### 16. Code Review
- [ ] Review all PRs for security issues
- [ ] Use automated security scanning (Snyk, Dependabot)
- [ ] Regular dependency updates
- [ ] Code signing for releases

### 17. Access Control
- [ ] Implement role-based access control (RBAC)
- [ ] Regular access audits
- [ ] Remove unused accounts
- [ ] Implement least privilege principle

### 18. Incident Response
- [ ] Create security incident playbook
- [ ] Set up security alert channels
- [ ] Regular security drills
- [ ] Maintain security contacts list

## 🔧 Configuration Checklist

### Environment Variables Required
**Backend (.env):**
```bash
# CRITICAL: Generate new values for all of these
GEMINI_API_KEY=<your-new-key>
DATABASE_URL=<your-supabase-connection-string>
SECRET_KEY=<generate-with-python-command>
JWT_SECRET_KEY=<generate-with-python-command>
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
ENVIRONMENT=production
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900
REDIS_URL=redis://localhost:6379  # Optional for caching
SENTRY_DSN=<your-sentry-dsn>  # Optional for error tracking
```

**Frontend (.env):**
```bash
VITE_API_URL=https://your-backend-url.com
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-new-anon-key>
```

### Pre-Deployment Checklist
- [ ] All secrets rotated and environment variables set
- [ ] `.env` files not in git history
- [ ] All tests passing
- [ ] Security headers configured
- [ ] HTTPS enabled with valid certificate
- [ ] Rate limiting configured
- [ ] Logging and monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking configured
- [ ] Documentation updated

## 📞 Emergency Contacts

If you discover a security breach:
1. Immediately rotate all credentials
2. Check logs for unauthorized access
3. Notify all users if data was compromised
4. Document the incident
5. Implement fixes and test thoroughly
6. Update this checklist with lessons learned

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Python Security Best Practices](https://python.readthedocs.io/en/stable/library/security_warnings.html)

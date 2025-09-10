# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public issue

**Do not** create a public GitHub issue for security vulnerabilities. This could expose the vulnerability to malicious actors.

### 2. Report privately

Please report security vulnerabilities privately by:

- **Email**: Send details to [security@yourdomain.com](mailto:security@yourdomain.com)
- **GitHub Security Advisories**: Use GitHub's private vulnerability reporting feature

### 3. Include the following information

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Impact**: Potential impact and severity
- **Affected versions**: Which versions are affected
- **Suggested fix**: If you have suggestions for fixing the issue

### 4. Response timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Resolution**: As quickly as possible, typically within 30 days

## Security Measures

### Authentication & Authorization
- JWT tokens with secure signing keys
- Password hashing using bcrypt
- Session management and token expiration
- Input validation and sanitization

### API Security
- Rate limiting (planned)
- CORS configuration
- Request validation using Joi
- Secure headers (planned)

### Data Protection
- Environment variable protection
- Database connection security
- No sensitive data in logs
- Secure cookie configuration

### Dependencies
- Regular dependency updates
- Security audit checks
- Vulnerability scanning (planned)

## Security Best Practices

### For Developers
- Never commit sensitive data (API keys, passwords, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Follow secure coding practices
- Keep dependencies updated

### For Users
- Use strong, unique passwords
- Keep your browser updated
- Report suspicious activity
- Don't share your login credentials

## Security Updates

Security updates will be released as:
- **Patch versions** (1.0.1, 1.0.2, etc.) for critical security fixes
- **Minor versions** (1.1.0, 1.2.0, etc.) for security improvements
- **Major versions** (2.0.0, 3.0.0, etc.) for breaking security changes

## Acknowledgments

We appreciate the security research community and will acknowledge security researchers who responsibly disclose vulnerabilities.

## Contact

For security-related questions or concerns:
- **Email**: [security@yourdomain.com](mailto:security@yourdomain.com)
- **GitHub**: Use private vulnerability reporting

---

**Thank you for helping keep Artsy Angular Web Service secure!** 🔒

# Contributing to Artsy Angular Web Service

Thank you for your interest in contributing to the Artsy Angular Web Service! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. Check if the issue already exists in the [Issues](https://github.com/your-repo/issues) section
2. Create a new issue with:
   - Clear, descriptive title
   - Detailed description of the problem
   - Steps to reproduce (if applicable)
   - Expected vs actual behavior
   - Screenshots (if relevant)

### Suggesting Features

1. Check if the feature request already exists
2. Create a new issue with:
   - Clear, descriptive title
   - Detailed description of the feature
   - Use cases and benefits
   - Mockups or examples (if applicable)

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the coding standards
   - Write tests for new functionality
   - Update documentation as needed
4. **Test your changes**
   ```bash
   # Run backend tests
   npm test
   
   # Run frontend tests
   cd client
   ng test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 📝 Coding Standards

### TypeScript/Angular
- Follow the [Angular Style Guide](https://angular.dev/style-guide)
- Use TypeScript strict mode
- Write meaningful variable and function names
- Add JSDoc comments for public APIs
- Use consistent indentation (2 spaces)

### Node.js/Express
- Follow [Node.js best practices](https://github.com/goldbergyoni/nodebestpractices)
- Use async/await over callbacks
- Handle errors appropriately
- Validate input data
- Use environment variables for configuration

### Git Commit Messages
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add JWT token refresh functionality
fix(search): resolve API timeout issues
docs(readme): update installation instructions
```

## 🧪 Testing

### Backend Testing
- Write unit tests for all new functions
- Test API endpoints with proper status codes
- Mock external API calls
- Test error handling scenarios

### Frontend Testing
- Write unit tests for components and services
- Test user interactions
- Mock HTTP requests
- Test responsive design

### Running Tests
```bash
# Backend tests
npm test

# Frontend tests
cd client
ng test

# E2E tests (if implemented)
ng e2e
```

## 📚 Documentation

- Update README.md for significant changes
- Add JSDoc comments for new functions
- Update API documentation for new endpoints
- Include examples in code comments

## 🔍 Code Review Process

1. All pull requests require review
2. Address review comments promptly
3. Ensure all tests pass
4. Update documentation as needed
5. Squash commits if requested

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Operating System
   - Node.js version
   - Browser (for frontend issues)
   - Package versions

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected behavior
   - Actual behavior

3. **Additional Context**
   - Screenshots or videos
   - Error messages
   - Console logs

## 💡 Feature Requests

When suggesting features:

1. **Problem Description**
   - What problem does this solve?
   - Who would benefit from this feature?

2. **Proposed Solution**
   - How should this work?
   - Any design considerations?

3. **Alternatives Considered**
   - What other solutions were considered?
   - Why is this approach preferred?

## 📞 Getting Help

- Check existing [Issues](https://github.com/your-repo/issues)
- Review [Discussions](https://github.com/your-repo/discussions)
- Create a new issue for questions

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Artsy Angular Web Service! 🎨

# Contributing to Modal State Manager

Thank you for considering contributing to Modal State Manager! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Any relevant screenshots or error messages
- Your environment (browser, OS, etc.)

### Suggesting Features

We welcome feature suggestions! Please create an issue with:

- A clear, descriptive title
- A detailed description of the proposed feature
- Any relevant examples or mockups
- Why this feature would be useful to most users

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run lint checks (`pnpm lint`)
5. Commit your changes using conventional commits:
   ```bash
   # Examples:
   git commit -m "feat: add new transition animation"
   git commit -m "fix: resolve issue with back navigation"
   git commit -m "docs: update API documentation"
   ```
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

### Pull Request Guidelines

- Follow the existing code style
- Update documentation as needed
- Keep PRs focused on a single change
- Link to any relevant issues
- Use conventional commit messages

### Commit Message Format

We use conventional commits to automate versioning and changelog generation. Your commit messages should follow this format:
```
type(scope?): message
```

### Types:

feat: A new feature
fix: A bug fix
docs: Documentation only changes
style: Changes that don't affect the code's meaning
refactor: Code change that neither fixes a bug nor adds a feature
perf: Code change that improves performance
chore: Changes to the build process or auxiliary tools


## Development Setup

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start development server: `pnpm dev`

## Documentation

- Update the README.md with any necessary changes
- Add TSDoc comments to all public functions and components
- Create examples for new features in the examples directory
- Update type definitions as needed

## Versioning

We follow [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backward compatible manner
- PATCH version for backward compatible bug fixes

## Release Process

Releases are automated using standard-version and GitHub Actions:

1. Changes are merged to main
2. To create a new release:
   ```bash
   pnpm release        # for patch release
   pnpm release:minor  # for minor release
   pnpm release:major  # for major release
   ```
3. Push changes and tags:
   ```bash
   git push --follow-tags origin main
   ```
4. GitHub Actions will automatically publish to npm

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

# Contributing to HabitForge

First off, thank you for considering contributing to HabitForge! It's people like you that make HabitForge such a great tool for building better habits.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- MongoDB (for backend development)
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository**
   
   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/HabitForge.git
   cd HabitForge
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Divyansh723/HabitForge.git
   ```

4. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd server
   npm install
   cd ..
   ```

5. **Set up environment variables**
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```
   
   Update the `.env` files with your local configuration.

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-habit-templates`)
- `fix/` - Bug fixes (e.g., `fix/streak-calculation`)
- `docs/` - Documentation updates (e.g., `docs/api-endpoints`)
- `refactor/` - Code refactoring (e.g., `refactor/habit-service`)
- `test/` - Adding tests (e.g., `test/gamification-logic`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### Workflow Steps

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run tests
   npm test
   
   # Run linter
   npm run lint
   
   # Type check
   npx tsc --noEmit
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add habit templates feature"
   ```

5. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   
   Go to the original repository and click "New Pull Request"

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type
- Use strict mode

```typescript
// Good
interface HabitProps {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'custom';
}

// Bad
interface HabitProps {
  id: any;
  name: any;
  frequency: any;
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary' 
}) => {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Support both light and dark modes
- Ensure responsive design

```typescript
// Good
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
    Title
  </h2>
</div>
```

### File Organization

- One component per file
- Co-locate related files (component, styles, tests)
- Use index files for clean imports
- Keep files under 300 lines

```
components/
├── habit/
│   ├── HabitCard.tsx
│   ├── HabitCard.test.tsx
│   ├── HabitList.tsx
│   ├── HabitList.test.tsx
│   └── index.ts
```

### Testing

- Write tests for all new features
- Aim for 80%+ code coverage
- Test behavior, not implementation
- Use descriptive test names

```typescript
describe('HabitCard', () => {
  it('should display habit name and streak', () => {
    const habit = { name: 'Exercise', currentStreak: 5 };
    render(<HabitCard habit={habit} />);
    
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
```

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

```typescript
<button
  onClick={handleClick}
  aria-label="Mark habit as complete"
  className="..."
>
  <CheckIcon />
</button>
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(gamification): add forgiveness token system

Implement the ability for users to use forgiveness tokens to maintain
streaks when they miss a day. Tokens are earned at milestone levels.

Closes #123

---

fix(analytics): correct perfect day calculation

Perfect days now only count daily habits, excluding weekly and custom
habits from the calculation.

---

docs(readme): update installation instructions

Add MongoDB setup steps and clarify environment variable configuration.
```

### Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests in the footer

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated and passing
- [ ] No console errors or warnings
- [ ] Tested in both light and dark modes
- [ ] Tested on mobile and desktop

### PR Title Format

Use the same format as commit messages:

```
feat(scope): brief description
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Added tests
- [ ] Tests pass locally
- [ ] No new warnings

## Related Issues
Closes #(issue number)
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed

### After Merge

- Delete your branch
- Update your local repository
- Celebrate! 🎉

## Issue Reporting

### Before Creating an Issue

- Search existing issues to avoid duplicates
- Check if it's already fixed in the latest version
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or other context.
```

## Feature Requests

We love new ideas! When suggesting features:

1. **Check existing requests** - Your idea might already be proposed
2. **Be specific** - Clearly describe the feature and its benefits
3. **Consider scope** - Is it aligned with HabitForge's goals?
4. **Provide examples** - Show how it would work
5. **Discuss impact** - How would it affect existing features?

## Questions?

- **General questions**: Use [GitHub Discussions](https://github.com/Divyansh723/HabitForge/discussions)
- **Bug reports**: Create an [issue](https://github.com/Divyansh723/HabitForge/issues)
- **Security issues**: Email [security@habitforge.com] (do not create public issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to HabitForge! 🎯

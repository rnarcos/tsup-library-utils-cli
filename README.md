# 🔧 tsup-library-utils-cli

A comprehensive CLI tool and monorepo for library maintainers using [tsup](https://tsup.egoist.dev/). This project provides both the CLI tooling and example implementations to help you build, maintain, and distribute high-quality JavaScript and TypeScript libraries.

## ✨ Features

- **🔨 Build Command**: Build libraries with dual ESM/CJS output using tsup
- **🧹 Clean Command**: Remove build artifacts and reset to development mode
- **📦 Dev Command**: Generate development package.json files for monorepos
- **🎯 Type-Safe**: Built with JavaScript + JSDoc for full TypeScript experience
- **⚡ Fast**: Powered by tsup and esbuild for lightning-fast builds
- **🔄 Watch Mode**: Real-time rebuilding during development
- **📋 Validation**: Comprehensive project structure and configuration validation
- **🏗️ Examples**: Complete recipe examples for different library types

## 🚀 Quick Start

### Installation

```bash
# Install globally
pnpm add -g tsup-library-utils-cli

# Or use directly with npx
npx tsup-library-utils-cli --help
```

### Basic Usage

```bash
# Build a library
tsup-lib build

# Clean build artifacts
tsup-lib clean

# Generate dev package.json files
tsup-lib dev

# Watch mode for monorepos
tsup-lib dev --watch

# Single repository mode
tsup-lib dev --single-repo
```

## 📁 Monorepo Structure

```
tsup-library-utils-cli/
├── packages/
│   └── cli/              # Main CLI package
│       ├── src/
│       │   ├── commands/ # Command implementations
│       │   ├── utils/    # Utility functions
│       │   ├── schemas/  # Zod validation schemas
│       │   └── index.js  # CLI entry point
│       └── package.json
├── recipes/              # Example library implementations
│   ├── js-library/       # JavaScript library with JSDoc
│   ├── ts-library/       # TypeScript library
│   ├── react-component/  # React component library
│   └── react-native/     # React Native library
└── package.json          # Root monorepo config
```

## 🛠️ CLI Commands

### `tsup-lib build`

Build a library package using tsup with dual ESM/CJS output.

```bash
tsup-lib build [options]

Options:
  -p, --path <path>      Package path to build (default: current directory)
  --skip-validation      Skip project structure validation
  --verbose             Enable verbose logging
```

**Features:**

- TypeScript compilation with declaration files
- Dual format output (ESM + CJS)
- Automatic proxy package generation
- Source map generation
- Build artifact optimization

### `tsup-lib clean`

Remove build artifacts and reset package.json to development mode.

```bash
tsup-lib clean [options]

Options:
  -p, --path <path>      Package path to clean (default: current directory)
  --skip-validation      Skip project structure validation
  --verbose             Enable verbose logging
```

### `tsup-lib dev`

Generate development-friendly package.json files for monorepos.

```bash
tsup-lib dev [options]

Options:
  -p, --path <path>           Root path to process (default: current directory)
  -w, --watch                 Watch for file changes and auto-regenerate
  --workspaces <names...>     Workspace directories (default: ["packages"])
  --single-repo              Single repository mode
  --verbose                   Enable verbose logging
```

**Features:**

- Monorepo workspace detection
- Automatic export generation
- File watching with hot reload
- Development-mode package.json generation

## 📚 Recipe Examples

### JavaScript Library (with JSDoc)

A complete example showing how to build a JavaScript library with full TypeScript support via JSDoc annotations.

```bash
cd recipes/js-library
pnpm install
pnpm build
```

**Features:**

- JSDoc type annotations
- ESM/CJS dual output
- Node.js native testing
- Zero TypeScript compilation

### TypeScript Library

Advanced TypeScript library example with comprehensive patterns and testing.

```bash
cd recipes/ts-library
pnpm install
pnpm build
pnpm test
```

**Features:**

- Advanced TypeScript patterns
- Zod validation
- Event system implementation
- Vitest testing framework
- Concurrent async processing

### React Component Library

React component library with TypeScript and modern build tooling.

```bash
cd recipes/react-component
pnpm install
pnpm build
pnpm test
```

### React Native Library

React Native library example with platform-specific builds.

```bash
cd recipes/react-native
pnpm install
pnpm build
```

## ⚙️ Configuration

### Package.json Structure

For dual-purpose packages (both CLI and library):

```json
{
  "name": "my-library",
  "main": "cjs/index.cjs",
  "module": "esm/index.js",
  "types": "esm/index.d.ts",
  "bin": {
    "my-cli": "./src/index.js"
  },
  "exports": {
    "./utils": {
      "import": "./esm/utils.js",
      "require": "./cjs/utils.cjs",
      "types": "./esm/utils.d.ts"
    }
  }
}
```

### TypeScript Configuration

Recommended `tsconfig.json` for JavaScript projects:

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "declaration": true,
    "emitDeclarationOnly": false,
    "noEmit": false
  },
  "include": ["src/**/*.js"]
}
```

### Build Configuration

Example `tsup.config.js`:

```javascript
export default {
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  target: 'node18',
  splitting: true,
  sourcemap: true,
  clean: false,
  dts: false, // Handled by TypeScript
  external: ['dependency-name'],
};
```

## 🔍 Validation & Error Handling

The CLI provides comprehensive validation and helpful error messages:

### Project Structure Validation

- ✅ Package.json validation with Zod schemas
- ✅ TypeScript configuration checks
- ✅ Source directory structure validation
- ✅ Workspace configuration validation

### Error Messages

- 🚨 **Clear error descriptions** with context
- 💡 **Actionable suggestions** for fixes
- 🔍 **Verbose mode** for debugging
- 📋 **Validation bypass** options

## 🏗️ Development

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd tsup-library-utils-cli

# Install dependencies
pnpm install

# Build the CLI
pnpm build:cli

# Test the CLI
cd packages/cli
node src/index.js --help
```

### Scripts

```bash
# Build all packages
pnpm build

# Clean all artifacts
pnpm clean

# Development mode with watching
pnpm dev

# Format code
pnpm format

# Lint code
pnpm lint

# Type checking
pnpm typecheck
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

## 📄 License

MIT © Library Maintainers Community

## 🙏 Acknowledgments

- [tsup](https://tsup.egoist.dev/) - The fast TypeScript bundler
- [Commander.js](https://github.com/tj/commander.js/) - Command-line interface framework
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Turborepo](https://turbo.build/) - High-performance build system

# tsup-library-utils-cli Documentation

A comprehensive CLI tool for library maintainers using tsup for building modern JavaScript and TypeScript libraries.

## Overview

The `tsup-library-utils-cli` provides a complete toolkit for library development, including building, cleaning, development workflows, and staging deployments. It's designed to work with both monorepos and single repositories, offering intelligent package.json management and dual-format builds (CJS/ESM).

## Commands

- **[build](./build.md)** - Build library packages using tsup with intelligent configuration
- **[clean](./clean.md)** - Clean build artifacts and generated files
- **[dev](./dev.md)** - Development workflow with automatic package.json management
- **[publish:staging](./publish-staging.md)** - Staging deployment with Verdaccio integration

## Key Features

### Intelligent Package.json Management

The CLI automatically manages your `package.json` exports, main/module fields, and bin entries based on your build configuration and development/production modes.

### Conditional Exports Support

Automatically generates proper conditional exports with `import`, `require`, and `types` fields based on your package configuration:

```json
{
  "exports": {
    ".": {
      "types": "./esm/index.d.ts",
      "import": "./esm/index.js",
      "require": "./cjs/index.cjs"
    }
  }
}
```

### Dual-Format Builds

Supports building both CommonJS (.cjs) and ES Modules (.js) with proper type declarations, allowing your library to work in any environment.

### Monorepo & Single Repo Support

Works seamlessly with both monorepo structures (using workspaces) and single repository setups.

## Installation

```bash
npm install -g tsup-library-utils-cli
# or
pnpm add -g tsup-library-utils-cli
# or
yarn global add tsup-library-utils-cli
```

## Quick Start

```bash
# Build your library
tsup-lib build

# Start development mode with file watching
tsup-lib dev --watch

# Clean build artifacts
tsup-lib clean

# Set up staging environment for testing
tsup-lib publish:staging
```

## Global Options

- `--verbose` - Enable detailed logging for all commands
- `--help` - Show help information for any command

## Configuration

The CLI works with standard `package.json` and `tsconfig.json` files. No additional configuration files are required, though you can customize behavior through these standard files.

### Supported Package.json Fields

- `main` - CommonJS entry point
- `module` - ES Module entry point
- `types` - TypeScript declarations
- `bin` - Binary executables
- `exports` - Package exports (auto-generated)

The CLI intelligently updates these fields based on your build configuration and current mode (development vs production).

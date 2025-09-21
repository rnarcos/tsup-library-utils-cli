# Clean Command

Clean build artifacts and generated files from library packages.

## Usage

```bash
tsup-lib clean [options]
```

## Options

- `-p, --path <path>` - Package path to clean (default: current directory)
- `--skip-validation` - Skip project structure validation
- `--verbose` - Enable verbose logging

## Description

The clean command removes all build artifacts, generated files, and temporary directories created during the build process. It's designed to restore your package to a clean development state.

## What It Cleans

### Build Directories

- `cjs/` - CommonJS build output
- `esm/` - ES Module build output
- `dist/` - Temporary build directory
- `.cache/` - Build cache files
- `.turbo/` - Turbo cache (in monorepos)

### Generated Files

- `*.tsbuildinfo` - TypeScript incremental build info
- `*.d.ts` files in root directory
- Temporary configuration files

### Proxy Packages

Removes generated proxy packages for subpath exports:

- `utils/package.json` (if generated)
- `components/package.json` (if generated)
- Any other subpath proxy packages

### Package.json Restoration

Reverts package.json to development mode:

#### Before Clean (Production State)

```json
{
  "main": "cjs/index.cjs",
  "module": "esm/index.js",
  "types": "esm/index.d.ts",
  "bin": {
    "my-cli": "./cjs/cli.cjs"
  },
  "exports": {
    ".": {
      "types": "./esm/index.d.ts",
      "import": "./esm/index.js",
      "require": "./cjs/index.cjs"
    }
  }
}
```

#### After Clean (Development State)

```json
{
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "bin": {
    "my-cli": "./src/cli.js"
  },
  "exports": {
    ".": {
      "types": "./src/index.js",
      "import": "./src/index.js",
      "require": "./src/index.js"
    }
  }
}
```

### .gitignore Updates

Removes build directories from .gitignore that were added during build:

```gitignore
# These entries are removed:
cjs
esm
dist
.cache
utils          # Proxy packages
components     # Proxy packages
```

## Validation

### Project Structure Check

Before cleaning, validates:

- Package.json exists and is valid
- Target directory is accessible
- Write permissions are available

### Safe Cleaning

- Only removes known build artifacts
- Preserves source files and configuration
- Maintains package.json structure while updating paths
- Never removes user-created files

## Examples

### Basic Usage

```bash
# Clean current directory
tsup-lib clean

# Clean specific package
tsup-lib clean --path ./packages/my-lib

# Clean with verbose output
tsup-lib clean --verbose
```

### Monorepo Usage

```bash
# Clean all packages (run from root)
pnpm run clean  # Uses turbo to clean all packages

# Clean single package in monorepo
cd packages/my-lib && tsup-lib clean

# Clean workspace and root
pnpm run clean:workspaces
```

### CI/CD Integration

```bash
# Fast clean without validation
tsup-lib clean --skip-validation

# Clean with full logging
tsup-lib clean --verbose
```

## When to Use Clean

### Development Workflow

- **After major changes** - Clean slate for testing builds
- **Before publishing** - Ensure no stale artifacts
- **Switching branches** - Remove build state from previous branch
- **Debugging builds** - Eliminate cached/stale files

### Common Scenarios

```bash
# Full rebuild workflow
tsup-lib clean && tsup-lib build

# Development reset
tsup-lib clean && tsup-lib dev

# Pre-publish cleanup
tsup-lib clean && tsup-lib build && npm publish
```

### Monorepo Workflows

```bash
# Clean everything and rebuild
pnpm run clean:workspaces && pnpm run build

# Clean specific package before changes
tsup-lib clean --path packages/core
```

## Troubleshooting

### Permission Issues

```
❌ Clean failed: EACCES: permission denied
💡 Check write permissions in the target directory
💡 Ensure no files are locked by other processes
```

### Validation Errors

```
❌ Package.json not found
💡 Ensure you're in the correct directory
💡 Use --path to specify the package location
```

### Partial Cleaning

If clean fails partway through:

- Some directories may remain
- Package.json might be partially updated
- Re-run clean command to complete the process
- Use `--verbose` to see exactly what failed

## Safety Features

### Preservation Guarantees

- **Source files** - Never touches src/ directory
- **Configuration** - Preserves tsconfig.json, package.json structure
- **Dependencies** - Leaves node_modules untouched
- **User files** - Only removes known build artifacts

### Rollback Protection

- Package.json changes are atomic
- If cleaning fails, original state is preserved
- No destructive operations on source code

### Validation Safeguards

- Confirms package.json exists before cleaning
- Verifies directory structure before proceeding
- Checks write permissions before making changes

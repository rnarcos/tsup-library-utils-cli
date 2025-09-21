# Publish Staging Command

Set up staging environment and publish packages for testing using Verdaccio integration.

## Usage

```bash
tsup-lib publish:staging [options]
```

## Options

- `-p, --port <number>` - Registry port number (default: 4873)
- `--path <path>` - Package path to publish (default: current directory)
- `--no-build` - Skip building the package before publishing
- `--reuse-server` - Automatically reuse existing Verdaccio servers without prompting
- `--force` - Force republish existing packages (overwrite existing versions)
- `--staging-version` - Use staging-specific versioning (adds staging suffix)
- `--verbose` - Enable verbose logging

## Description

The publish:staging command provides a complete staging workflow for testing your library packages before publishing to the public npm registry. It integrates Verdaccio (a lightweight npm proxy registry) to create a local testing environment.

## Why Use Staging?

### The Testing Problem

Before publishing to npm, you need to test how your package behaves in a real production environment:

- **Import resolution** - Does your package import correctly?
- **Dependency resolution** - Are all dependencies properly declared?
- **Bundle size** - How large is the published package?
- **Installation** - Does `npm install` work correctly?
- **Runtime behavior** - Does it work in different environments?

### The Solution: Local Registry Testing

Staging mode creates a local npm registry where you can:

- Publish your package safely
- Install it in test projects
- Verify production behavior
- Test different versions
- Validate package contents

## Verdaccio Integration

### What is Verdaccio?

Verdaccio is a lightweight Node.js private proxy registry that:

- Acts as a local npm registry
- Proxies requests to public npm for dependencies
- Stores your packages locally
- Provides a web interface for package management
- Supports npm/yarn/pnpm clients

### Automatic Setup

The staging command automatically:

1. **Creates Verdaccio configuration** - Optimized for local testing
2. **Starts Verdaccio server** - On specified port (default: 4873)
3. **Configures authentication** - Allows unauthenticated publishing for testing
4. **Sets up .npmrc** - Temporary configuration for publishing
5. **Manages server lifecycle** - Starts/stops as needed

## Workflow

### Basic Staging Workflow

```bash
# 1. Start staging environment
tsup-lib publish:staging

# 2. Test in another project
cd ../test-project
npm install my-package --registry http://localhost:4873

# 3. Verify it works
node -e "console.log(require('my-package'))"
```

### Advanced Workflow

```bash
# Custom port
tsup-lib publish:staging --port 3000

# Skip building (if already built)
tsup-lib publish:staging --no-build

# Force overwrite existing version
tsup-lib publish:staging --force

# Use staging version (0.1.0-staging.1234567890)
tsup-lib publish:staging --staging-version
```

## Server Management

### Automatic Server Detection

The command intelligently manages Verdaccio servers:

```bash
# First run - starts new server
tsup-lib publish:staging --port 4873
# ✅ Starting new Verdaccio server on port 4873

# Second run - detects existing server
tsup-lib publish:staging --port 4873
# ✅ Found existing Verdaccio server on port 4873
# 🤔 Reuse existing server? [Y/n]
```

### Server Reuse Options

```bash
# Automatically reuse without prompting
tsup-lib publish:staging --reuse-server

# Force new server (different port)
tsup-lib publish:staging --port 4874
```

### Multi-Package Publishing

Perfect for monorepos:

```bash
# Terminal 1: Start registry
tsup-lib publish:staging --port 4873

# Terminal 2: Publish package A
cd packages/package-a
tsup-lib publish:staging --port 4873 --reuse-server

# Terminal 3: Publish package B
cd packages/package-b
tsup-lib publish:staging --port 4873 --reuse-server
```

## Version Conflict Resolution

### The Problem

When testing, you often need to republish the same version:

```bash
npm error code E409
npm error 409 Conflict - PUT http://localhost:4873/my-package
npm error this package is already present
```

### Solutions

#### 1. Force Mode (--force)

```bash
tsup-lib publish:staging --force
```

- Unpublishes existing version first
- Then publishes new version
- Overwrites completely

#### 2. Staging Versions (--staging-version)

```bash
tsup-lib publish:staging --staging-version
```

- Generates unique version: `1.0.0-staging.1672531200`
- Uses timestamp suffix
- No conflicts, each publish gets new version
- Publishes from temporary directory (doesn't modify your package.json)

#### 3. Interactive Resolution

```bash
tsup-lib publish:staging
# ⚠️ Package my-package@1.0.0 already exists in registry
#
# 🤔 How would you like to resolve this conflict?
#    1. Use staging version (recommended)
#    2. Force overwrite existing package
#    3. Cancel publishing
#
# Select option [1-3]: 1
```

## Safety Features

### .npmrc Management

The command safely manages npm configuration:

#### Existing .npmrc Detection

```bash
# If you have existing .npmrc:
# ⚠️ Existing .npmrc file detected!
#    Current .npmrc content:
#    ├─────────────────────
#    │ registry=https://my-company-registry.com
#    │ //my-company-registry.com/:_authToken=xxx
#    └─────────────────────
#    This process will create a temporary .npmrc.staging file
#    Your existing .npmrc will NOT be modified
```

#### Temporary Configuration

- Creates `.npmrc.staging` for publishing
- Uses it only during staging session
- Deletes it automatically after publishing
- Never modifies your existing `.npmrc`

#### .gitignore Integration

```bash
# Automatically adds to .gitignore:
.npmrc*

# 💡 Recommendation: Add .npmrc files to .gitignore
#    Add this line to your .gitignore:
#    .npmrc*
```

### Registry Safety

```bash
# ✅ Registry Safety Check
# 📦 Package: my-package@1.0.0
# 🎯 Target Registry: http://localhost:4873
# ✅ Registry is localhost (safe)
#
# ⚠️ This will publish your package to the local staging registry.
# Proceed with publishing? [Y/n]
```

### CI Environment Support

```bash
# In CI (CI=true), skips interactive prompts:
export CI=true
tsup-lib publish:staging --staging-version
# ✅ Automatically proceeds without user interaction
```

## Configuration

### Verdaccio Configuration

Automatically generated configuration optimized for staging:

```yaml
# scripts/release/staging/.verdaccio/config.yml
storage: ./storage
auth:
  htpasswd:
    file: ./htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: $all
    publish: $all # Unauthenticated publishing
    unpublish: $all # Allows force mode
    proxy: npmjs
  '**':
    access: $all
    publish: $all
    unpublish: $all
    proxy: npmjs
web:
  enable: true
  title: 'Staging Registry'
listen:
  - 0.0.0.0:4873
```

### Port Management

```bash
# Check if port is available
tsup-lib publish:staging --port 4873
# ✅ Port 4873 is available for new Verdaccio server

# Auto-find available port if busy
tsup-lib publish:staging --port 4873
# ⚠️ Port 4873 is already in use
# 🔍 Checking alternative ports...
# ✅ Found available port: 4874
# Use port 4874 instead? [Y/n]
```

## Examples

### Basic Testing

```bash
# 1. Publish to staging
tsup-lib publish:staging

# 2. Create test project
mkdir test-app && cd test-app
npm init -y

# 3. Install from staging
npm install my-package --registry http://localhost:4873

# 4. Test the package
echo "const pkg = require('my-package'); console.log(pkg)" > test.js
node test.js
```

### Monorepo Testing

```bash
# Publish all packages to same registry
cd packages/core
tsup-lib publish:staging --port 4873

cd ../utils
tsup-lib publish:staging --port 4873 --reuse-server

cd ../components
tsup-lib publish:staging --port 4873 --reuse-server

# Test package interactions
cd ../../test-app
npm install @my-org/core @my-org/utils --registry http://localhost:4873
```

### Version Testing

```bash
# Test different versions
tsup-lib publish:staging --staging-version  # v1.0.0-staging.123
# ... make changes ...
tsup-lib publish:staging --staging-version  # v1.0.0-staging.456

# Install specific version
npm install my-package@1.0.0-staging.123 --registry http://localhost:4873
```

### CI Integration

```bash
# .github/workflows/test-staging.yml
- name: Test package in staging
  run: |
    export CI=true
    npm run build
    npx tsup-lib publish:staging --staging-version --port 4873

    # Test installation
    mkdir test-install && cd test-install
    npm init -y
    npm install my-package --registry http://localhost:4873
    node -e "require('my-package')"
```

## Web Interface

### Verdaccio Web UI

Access the web interface at `http://localhost:4873`:

- **Browse packages** - See all published packages
- **View package details** - Versions, dependencies, files
- **Download tarballs** - Inspect package contents
- **Manage packages** - Unpublish if needed

### Package Verification

```bash
# View package info
npm view my-package --registry http://localhost:4873

# Download and inspect
npm pack my-package --registry http://localhost:4873
tar -tzf my-package-1.0.0.tgz
```

## Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Error: Port 4873 is already in use
# Solution: Use different port or reuse existing
tsup-lib publish:staging --port 4874
# or
tsup-lib publish:staging --reuse-server
```

**Package Not Found After Publishing**

```bash
# Verify publication
npm view my-package --registry http://localhost:4873

# Check Verdaccio logs
tsup-lib publish:staging --verbose
```

**Authentication Errors**

```bash
# Staging uses unauthenticated publishing
# If you see auth errors, check .npmrc.staging:
cat .npmrc.staging
# Should contain: registry=http://localhost:4873
```

**Build Failures**

```bash
# Skip build if already built
tsup-lib publish:staging --no-build

# Or build separately first
tsup-lib build
tsup-lib publish:staging --no-build
```

### Best Practices

1. **Always test before publishing** - Use staging for every release
2. **Use staging versions** - Avoid version conflicts during testing
3. **Test installation** - Verify `npm install` works correctly
4. **Check bundle size** - Use `npm pack` to inspect contents
5. **Test in clean environment** - Use fresh directories for testing
6. **Verify dependencies** - Ensure all deps are properly declared
7. **Test different Node versions** - Use nvm or Docker

### Performance Tips

- Use `--reuse-server` for multiple packages
- Use `--no-build` if already built
- Use specific ports to avoid conflicts
- Keep Verdaccio running for multiple test sessions

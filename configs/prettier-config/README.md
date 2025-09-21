# @tsup-lib/prettier-config

Prettier configuration for tsup-library-utils-cli projects.

## Installation

```bash
npm install --save-dev @tsup-lib/prettier-config prettier
```

## Usage

### Default Configuration

Add to your `package.json`:

```json
{
  "prettier": "@tsup-lib/prettier-config"
}
```

Or create a `.prettierrc` file:

```json
"@tsup-lib/prettier-config"
```

### Base Configuration

For minimal library formatting:

```js
// prettier.config.js
module.exports = require('@tsup-lib/prettier-config/base');
```

### Web Configuration

For web projects with HTML, CSS, and JSX:

```js
// prettier.config.js
module.exports = require('@tsup-lib/prettier-config/web');
```

### Custom Configuration

Extend the base configuration:

```js
// prettier.config.js
module.exports = {
  ...require('@tsup-lib/prettier-config'),
  // Your custom overrides
  printWidth: 100,
  tabWidth: 4,
};
```

## Configurations

- **default** (index.cjs): Full configuration with language-specific overrides
- **base**: Minimal configuration for libraries
- **web**: Web-focused configuration with HTML, CSS, and JSX support

## Features

- Single quotes for JavaScript/TypeScript
- Trailing commas for better diffs
- 2-space indentation
- Semicolons enabled
- Line length of 80 characters
- Language-specific overrides for Markdown, JSON, YAML, etc.

## License

MIT

/* eslint-env commonjs, node */

/** @type {import('prettier').Config} */
module.exports = {
  // Minimal base configuration for libraries
  trailingComma: 'all',
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  printWidth: 80,
};

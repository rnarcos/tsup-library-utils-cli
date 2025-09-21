/* eslint-env commonjs, node */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@tsup-lib/eslint-config/node'],
  plugins: ['turbo'],
  rules: {
    'turbo/no-undeclared-env-vars': 'warn',
    // CLI-specific overrides
    'no-process-exit': 'off', // CLI tools need process.exit
    'import/extensions': 'off', // Allow .js extensions for clarity
    'import/order': 'warn', // Make import order a warning instead of error
    'no-unused-vars': 'warn', // Make unused vars warnings for CLI development
    'no-useless-catch': 'off', // Allow catch blocks for clarity in CLI tools
  },
  overrides: [
    {
      files: ['packages/cli/src/**/*.{js,ts}'],
      extends: ['@tsup-lib/eslint-config/node'],
      rules: {
        'no-console': 'off', // CLI tools need console output
        'no-process-exit': 'off', // CLI tools need process.exit
        'import/extensions': 'off', // Allow .js extensions for clarity
        'import/order': 'warn', // Make import order a warning
        'no-unused-vars': 'warn', // Make unused vars warnings
        'no-useless-catch': 'off', // Allow catch blocks for clarity in CLI tools
        'turbo/no-undeclared-env-vars': 'warn',
      },
    },
  ],
  root: true,
};

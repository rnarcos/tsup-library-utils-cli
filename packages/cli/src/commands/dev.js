/**
 * @fileoverview Dev command implementation
 * Development package.json generation with monorepo and single-repo support
 */

import { basename, join, resolve } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { watch } from 'chokidar';
import { glob } from 'glob';
import {
  shouldProcessInDev,
  readPackageJson,
  writePackageJson,
  PackageError,
  ConfigurationError,
} from '../utils/package.js';

/**
 * Dev options type definition
 * @typedef {Object} DevOptions
 * @property {boolean} watch - Watch for file changes
 * @property {string} path - Root path to process
 * @property {string[]} workspaces - Workspace directories
 * @property {boolean} singleRepo - Treat as single repository
 * @property {boolean} verbose - Enable verbose logging
 */

/**
 * Package information structure
 * @typedef {Object} PackageInfo
 * @property {string} path - Package path
 * @property {string} name - Package name
 * @property {boolean} isValid - Whether package is valid
 * @property {string} [error] - Error message if invalid
 */

/**
 * Dev command implementation with comprehensive error handling
 * @param {DevOptions} options - Dev command options
 * @returns {Promise<void>} Dev completion promise
 */
export async function devCommand(options) {
  const {
    watch: watchMode,
    path: rootPath,
    workspaces,
    singleRepo,
    verbose,
  } = options;

  console.log(chalk.blue(`📦 Processing development package.json files...`));
  console.log(chalk.gray(`   Root path: ${rootPath}`));

  try {
    if (singleRepo) {
      await processSingleRepository(rootPath, verbose);
    } else {
      await processMonorepo(rootPath, workspaces, verbose);
    }

    if (watchMode) {
      await startWatchMode(rootPath, workspaces, singleRepo, verbose);
    } else {
      console.log(
        chalk.green('✅ Development package.json processing completed!'),
      );
      console.log(chalk.gray(`   Root path: ${rootPath}`));
    }
  } catch (error) {
    if (error instanceof ConfigurationError) {
      console.error(chalk.red('\n❌ Configuration Error:'));
      console.error(chalk.red(`   ${error.message}`));

      if (error.suggestions.length > 0) {
        console.error(chalk.yellow('\n💡 Suggestions to fix this:'));
        error.suggestions.forEach((suggestion) => {
          console.error(chalk.yellow(`   • ${suggestion}`));
        });
      }
    } else if (error instanceof PackageError) {
      console.error(chalk.red('\n❌ Package Error:'));
      console.error(chalk.red(`   ${error.message}`));
      if (error.packagePath) {
        console.error(chalk.gray(`   Package: ${error.packagePath}`));
      }
    } else {
      console.error(chalk.red('\n❌ Unexpected error:'));
      console.error(
        chalk.red(
          `   ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }

    throw error; // Re-throw for proper CLI error handling
  }
}

/**
 * Process a single repository (non-monorepo)
 * @param {string} rootPath - Root path
 * @param {boolean} verbose - Enable verbose logging
 * @returns {Promise<void>} Processing promise
 */
async function processSingleRepository(rootPath, verbose) {
  console.log(chalk.blue('🏠 Single repository mode'));

  try {
    const packageInfo = analyzePackage(rootPath);

    if (!packageInfo.isValid) {
      throw new ConfigurationError(
        `Invalid package at ${rootPath}: ${packageInfo.error}`,
        [
          'Ensure package.json exists and is valid',
          'Check that the package has proper name and structure',
          'Verify src/ directory exists with source files',
        ],
      );
    }

    if (!shouldProcessInDev(rootPath)) {
      console.log(
        chalk.gray(`   Skipping pure CLI package: ${packageInfo.name}`),
      );
      return;
    }

    writePackageJson(rootPath);
    console.log(chalk.green(`   ✅ Updated ${packageInfo.name}`));

    if (verbose) {
      console.log(chalk.gray(`   Package: ${packageInfo.name} at ${rootPath}`));
    }
  } catch (error) {
    throw new PackageError(
      `Failed to process single repository: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Process a monorepo with multiple workspaces
 * @param {string} rootPath - Root path
 * @param {string[]} workspaces - Workspace directories
 * @param {boolean} verbose - Enable verbose logging
 * @returns {Promise<void>} Processing promise
 */
async function processMonorepo(rootPath, workspaces, verbose) {
  console.log(chalk.blue('🏢 Monorepo mode'));
  console.log(chalk.gray(`   Workspaces: ${workspaces.join(', ')}`));

  // Validate workspace directories
  const missingWorkspaces = workspaces.filter(
    (workspace) => !existsSync(join(rootPath, workspace)),
  );

  if (missingWorkspaces.length > 0) {
    throw new ConfigurationError(
      `Missing workspace directories: ${missingWorkspaces.join(', ')}`,
      [
        'Create the missing workspace directories',
        'Update --workspaces parameter to match your project structure',
        'Common workspace names: packages, apps, libs, tools, configs',
      ],
    );
  }

  // Find all packages
  const packagesGlobs = workspaces.map((workspace) => `${workspace}/*/src`);
  const packages = glob.sync(packagesGlobs, { cwd: rootPath });

  if (packages.length === 0) {
    throw new ConfigurationError('No packages found in workspace directories', [
      'Ensure packages have src/ directories',
      'Check that packages are properly structured',
      'Example structure: packages/my-lib/src/index.ts',
    ]);
  }

  console.log(chalk.gray(`   Found ${packages.length} packages to process`));

  // Analyze all packages
  const packageInfos = packages
    .map((pkg) => getPackagePathFromGlob(rootPath, pkg, workspaces))
    .filter(/** @returns {pkg is string} */ (pkg) => pkg !== null)
    .map(analyzePackage);

  // Separate packages by type
  const processablePackages = packageInfos.filter(
    (pkg) => pkg.isValid && shouldProcessInDev(pkg.path),
  );
  const skippedPackages = packageInfos.filter(
    (pkg) => pkg.isValid && !shouldProcessInDev(pkg.path),
  );
  const invalidPackages = packageInfos.filter((pkg) => !pkg.isValid);

  // Report status
  if (verbose || invalidPackages.length > 0) {
    console.log(chalk.blue(`\n📊 Package Analysis:`));
    console.log(
      chalk.green(`   Processable packages: ${processablePackages.length}`),
    );
    console.log(
      chalk.yellow(`   Skipped packages (pure CLI): ${skippedPackages.length}`),
    );
    console.log(chalk.red(`   Invalid packages: ${invalidPackages.length}`));
  }

  // Warn about invalid packages
  if (invalidPackages.length > 0) {
    console.log(chalk.yellow(`\n⚠️  Invalid packages found:`));
    invalidPackages.forEach((pkg) => {
      console.log(
        chalk.yellow(
          `   • ${pkg.name || 'Unknown'} at ${pkg.path}: ${pkg.error}`,
        ),
      );
    });
  }

  // Process valid packages
  let processedCount = 0;
  let errorCount = 0;

  for (const pkg of processablePackages) {
    try {
      writePackageJson(pkg.path);
      processedCount++;

      if (verbose) {
        console.log(chalk.green(`   ✅ ${pkg.name}`));
      }
    } catch (error) {
      errorCount++;
      console.warn(
        chalk.yellow(
          `   ⚠️  Failed to process ${pkg.name}: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  console.log(
    chalk.green(`\n✅ Processed ${processedCount} packages successfully`),
  );

  if (errorCount > 0) {
    console.log(chalk.yellow(`⚠️  ${errorCount} packages had errors`));
  }
}

/**
 * Start watch mode for file changes
 * @param {string} rootPath - Root path
 * @param {string[]} workspaces - Workspace directories
 * @param {boolean} singleRepo - Single repository mode
 * @param {boolean} verbose - Enable verbose logging
 * @returns {Promise<void>} Watch mode promise
 */
async function startWatchMode(rootPath, workspaces, singleRepo, verbose) {
  console.log(chalk.blue('\n👀 Starting watch mode...'));
  console.log(chalk.yellow('Press Ctrl+C to stop watching\n'));

  const watchPatterns = singleRepo
    ? ['src/**/*']
    : workspaces.map((workspace) => `${workspace}/*/src/**/*`);

  const watcher = watch(watchPatterns, {
    ignoreInitial: true,
    cwd: rootPath,
    ignored: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/.git/**'],
  });

  /**
   * Process file changes
   * @param {string} filePath - Changed file path
   */
  const processFileChange = (filePath) => {
    try {
      const packagePath = singleRepo
        ? rootPath
        : getPackagePathFromFile(rootPath, filePath, workspaces);

      if (!packagePath) {
        if (verbose) {
          console.log(
            chalk.gray(`   Ignored: ${filePath} (not in a valid package)`),
          );
        }
        return;
      }

      const packageInfo = analyzePackage(packagePath);

      if (!packageInfo.isValid || !shouldProcessInDev(packagePath)) {
        if (verbose) {
          console.log(
            chalk.gray(
              `   Ignored: ${packageInfo.name || filePath} (${!packageInfo.isValid ? 'invalid' : 'pure CLI'} package)`,
            ),
          );
        }
        return;
      }

      writePackageJson(packagePath);
      console.log(chalk.blue(`🔄 Updated ${packageInfo.name} (${filePath})`));
    } catch (error) {
      console.warn(
        chalk.yellow(
          `⚠️  Error processing ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  };

  watcher
    .on('add', processFileChange)
    .on('unlink', processFileChange)
    .on('unlinkDir', (dirPath) => {
      if (verbose) {
        console.log(chalk.gray(`📂 Directory removed: ${dirPath}`));
      }
    })
    .on('error', (error) => {
      console.error(chalk.red(`❌ Watch error: ${error.message}`));
    });

  console.log(chalk.green('✅ Watch mode started successfully'));
}

/**
 * Get package path from glob pattern result
 * @param {string} rootPath - Root path
 * @param {string} pkgGlob - Package glob pattern
 * @param {string[]} workspaces - Workspace directories
 * @returns {string | null} Package path or null
 */
function getPackagePathFromGlob(rootPath, pkgGlob, workspaces) {
  const match = pkgGlob.match(
    new RegExp(`^(${workspaces.join('|')})/(.*)/src$`),
  );
  if (!match) return null;

  const [, workspace, pkg] = match;
  if (!workspace || !pkg) return null;

  return resolve(rootPath, workspace, pkg);
}

/**
 * Get package path from file change
 * @param {string} rootPath - Root path
 * @param {string} filePath - Changed file path
 * @param {string[]} workspaces - Workspace directories
 * @returns {string | null} Package path or null
 */
function getPackagePathFromFile(rootPath, filePath, workspaces) {
  const workspaceMatch = workspaces.find((workspace) =>
    filePath.startsWith(`${workspace}/`),
  );
  if (!workspaceMatch) return null;

  const pathParts = filePath.split('/');
  const workspaceIndex = pathParts.indexOf(workspaceMatch);

  if (workspaceIndex === -1 || pathParts.length <= workspaceIndex + 1)
    return null;

  const packageName = /**@type {pathParts[number]} */ (
    pathParts[workspaceIndex + 1]
  );
  return resolve(rootPath, workspaceMatch, packageName);
}

/**
 * Analyze a package and return its information
 * @param {string} packagePath - Package path to analyze
 * @returns {PackageInfo} Package information
 */
function analyzePackage(packagePath) {
  try {
    if (!existsSync(packagePath)) {
      return {
        path: packagePath,
        name: basename(packagePath),
        isValid: false,
        error: 'Package directory does not exist',
      };
    }

    const pkg = readPackageJson(packagePath);

    return {
      path: packagePath,
      name: pkg.name,
      isValid: true,
    };
  } catch (error) {
    return {
      path: packagePath,
      name: basename(packagePath),
      isValid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

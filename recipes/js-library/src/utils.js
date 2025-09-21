/**
 * @fileoverview Utility functions for the JavaScript library example
 * Demonstrates mathematical operations with JSDoc type annotations
 */

/**
 * Add two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 * @throws {TypeError} When inputs are not numbers
 */
export function add(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a + b;
}

/**
 * Multiply two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 * @throws {TypeError} When inputs are not numbers
 */
export function multiply(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a * b;
}

/**
 * Subtract second number from first number
 * @param {number} a - Number to subtract from
 * @param {number} b - Number to subtract
 * @returns {number} Difference of a and b
 * @throws {TypeError} When inputs are not numbers
 */
export function subtract(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  return a - b;
}

/**
 * Divide first number by second number
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 * @throws {TypeError} When inputs are not numbers
 * @throws {Error} When dividing by zero
 */
export function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

/**
 * Format a number with specified decimal places
 * @param {number} num - Number to format
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted number string
 * @throws {TypeError} When num is not a number or decimals is not an integer
 */
export function formatNumber(num, decimals = 2) {
  if (typeof num !== 'number') {
    throw new TypeError('First argument must be a number');
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new TypeError('Decimals must be a non-negative integer');
  }
  return num.toFixed(decimals);
}

/**
 * Check if a number is even
 * @param {number} num - Number to check
 * @returns {boolean} True if the number is even
 * @throws {TypeError} When input is not a number
 */
export function isEven(num) {
  if (typeof num !== 'number' || !Number.isInteger(num)) {
    throw new TypeError('Argument must be an integer');
  }
  return num % 2 === 0;
}

/**
 * Check if a number is odd
 * @param {number} num - Number to check
 * @returns {boolean} True if the number is odd
 * @throws {TypeError} When input is not a number
 */
export function isOdd(num) {
  if (typeof num !== 'number' || !Number.isInteger(num)) {
    throw new TypeError('Argument must be an integer');
  }
  return num % 2 !== 0;
}

/**
 * Mathematical constants
 * @namespace
 */
export const CONSTANTS = {
  /** Pi constant */
  PI: Math.PI,
  /** Euler's number */
  E: Math.E,
  /** Golden ratio */
  PHI: (1 + Math.sqrt(5)) / 2,
};

/**
 * Array of utility function names for introspection
 * @type {string[]}
 */
export const AVAILABLE_FUNCTIONS = [
  'add',
  'multiply',
  'subtract',
  'divide',
  'formatNumber',
  'isEven',
  'isOdd',
];

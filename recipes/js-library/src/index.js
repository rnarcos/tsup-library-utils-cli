/**
 * @fileoverview Main entry point for JavaScript library example
 * This demonstrates how to build a library using JavaScript with JSDoc annotations
 */

import { add, multiply, formatNumber } from './utils.js';

/**
 * Calculator class demonstrating JavaScript with JSDoc type annotations
 */
export class Calculator {
  /**
   * Create a new calculator
   * @param {number} [initialValue=0] - Initial value for the calculator
   */
  constructor(initialValue = 0) {
    /** @private @type {number} */
    this._value = initialValue;
  }

  /**
   * Get the current value
   * @returns {number} Current calculator value
   */
  get value() {
    return this._value;
  }

  /**
   * Add a number to the current value
   * @param {number} num - Number to add
   * @returns {Calculator} This calculator instance for chaining
   */
  add(num) {
    this._value = add(this._value, num);
    return this;
  }

  /**
   * Multiply the current value by a number
   * @param {number} num - Number to multiply by
   * @returns {Calculator} This calculator instance for chaining
   */
  multiply(num) {
    this._value = multiply(this._value, num);
    return this;
  }

  /**
   * Reset the calculator to zero
   * @returns {Calculator} This calculator instance for chaining
   */
  reset() {
    this._value = 0;
    return this;
  }

  /**
   * Get a formatted string representation of the current value
   * @param {number} [decimals=2] - Number of decimal places
   * @returns {string} Formatted number string
   */
  toString(decimals = 2) {
    return formatNumber(this._value, decimals);
  }
}

/**
 * Create a new calculator instance
 * @param {number} [initialValue=0] - Initial value for the calculator
 * @returns {Calculator} New calculator instance
 */
export function createCalculator(initialValue = 0) {
  return new Calculator(initialValue);
}

// Re-export utility functions
export { add, multiply, formatNumber } from './utils.js';

/**
 * Library version
 * @readonly
 */
export const VERSION = '1.0.0';

/**
 * Default calculator instance
 * @type {Calculator}
 */
export const defaultCalculator = new Calculator();

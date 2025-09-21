export default {
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  target: 'node18',
  splitting: true,
  sourcemap: true,
  clean: false, // Handled by our build script
  dts: false, // TypeScript declarations are handled by tsc
  external: [],
  /** @param {any} options */
  esbuildOptions(options) {
    // Customize chunk naming for better organization
    options.chunkNames = '__chunks/[hash]';
  },
};

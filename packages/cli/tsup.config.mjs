export default {
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  outDir: '.',
  splitting: false,
  sourcemap: false,
  external: [],
  shims: true, // This enables proper __filename and __dirname shims for CommonJS
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
};

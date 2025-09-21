export default {
  entry: ['src/*.cjs'],
  format: ['cjs'],
  outDir: '.',
  splitting: false,
  sourcemap: false,
  external: [],
  outExtension() {
    return {
      js: '.cjs',
    };
  },
};

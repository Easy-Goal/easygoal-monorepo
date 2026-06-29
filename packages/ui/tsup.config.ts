import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    script: 'src/theme/script.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom', 'next', 'lucide-react', '@easygoal/packages/auth/client'],
  clean: true,
  minify: false,
  sourcemap: true,
  treeshake: true,
});
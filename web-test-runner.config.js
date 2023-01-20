import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: ['/**/*.test.ts', '/**/*.spec.ts'],
  plugins: [esbuildPlugin({ ts: true })],
};
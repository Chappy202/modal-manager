import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  source: {
    // Use different entry points for dev and production
    entry:
      process.env.NODE_ENV === 'development'
        ? { index: './src/dev/index.tsx' } // Dev entry point
        : { index: './src/index.ts' }, // Production entry point
  },
  output: {
    distPath: {
      root: 'dist',
      js: 'lib',
    },
    cleanDistPath: true,
  },
  tools: {
    bundlerChain: chain => {
      // Only mark dependencies as external for production builds
      if (process.env.NODE_ENV === 'production') {
        chain.externals({
          react: 'React',
          'react-dom': 'ReactDOM',
          zustand: 'zustand',
        });

        // Library output settings only needed for production
        chain.output.libraryTarget('umd');
        chain.output.library('ModalManager');
        chain.output.globalObject('this');
      }
    },
  },
  plugins: [
    pluginReact(),
    // Only generate TypeScript declarations in production
    process.env.NODE_ENV === 'production' && {
      name: 'typescript-declaration',
      setup(api) {
        api.onAfterBuild(async () => {
          const { execSync } = require('child_process');
          execSync('tsc --emitDeclarationOnly --outDir dist/types');
        });
      },
    },
  ].filter(Boolean),
});

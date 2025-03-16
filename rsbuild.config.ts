import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      // For production build (library)
      ...(process.env.NODE_ENV === 'production'
        ? { index: './src/index.ts' }
        : {}),
      // For development build (examples)
      ...(process.env.NODE_ENV === 'development'
        ? { examples: './examples/index.tsx' }
        : {}),
    },
  },
  output: {
    // Library configuration for production
    ...(process.env.NODE_ENV === 'production'
      ? {
          distPath: {
            root: 'dist',
            js: 'lib',
          },
          filename: {
            js: '[name].js',
            css: '[name].css',
          },
          library: {
            type: 'umd',
            name: 'ModalManager',
          },
          cleanDistPath: true,
        }
      : {}),
    // Development configuration
    ...(process.env.NODE_ENV === 'development'
      ? {
          distPath: {
            root: 'dist-dev',
          },
        }
      : {}),
  },
  server: {
    open: true,
  },
  tools: {
    // Don't bundle peer dependencies in production
    bundlerChain: (chain, { CHAIN_ID }) => {
      if (process.env.NODE_ENV === 'production') {
        chain.externals({
          react: 'React',
          'react-dom': 'ReactDOM',
        });
      }
    },
  },
});

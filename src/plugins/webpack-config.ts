import type { Plugin } from '@docusaurus/types';

export default function webpackConfigPlugin(): Plugin {
  return {
    name: 'webpack-config-plugin',
    configureWebpack(config) {
      return {
        resolve: {
          fallback: {
            ...config.resolve?.fallback,
            fs: false,
            'fs/promises': false,
            module: false,
            path: false,
            os: false,
            crypto: false,
            stream: false,
            util: false,
            buffer: false,
            url: false,
            querystring: false,
            http: false,
            https: false,
            zlib: false,
            assert: false,
            constants: false,
            events: false,
            child_process: false,
          },
        },
        module: {
          rules: [
            // Handle WASM files
            {
              test: /\.wasm$/,
              type: 'asset/resource',
            },
            // Ignore native binary files
            {
              test: /\.node$/,
              type: 'javascript/auto',
              use: 'ignore-loader',
            },
          ],
        },
        experiments: {
          asyncWebAssembly: true,
        },
        // Configure web-tree-sitter to load WASM from static directory
        output: {
          ...config.output,
          publicPath: config.output?.publicPath || '/',
        },
      };
    },
  };
}

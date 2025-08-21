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
      };
    },
  };
}

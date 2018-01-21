import cssnano from 'cssnano';
import postcssCssnext from 'postcss-cssnext';
import packageJson from './package.json';

const {browserslist} = packageJson;

export default {
  autoprefixer: null,
  entry: 'src/index.js',
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
      extraBabelPresets: [
        [
          'env',
          {
            exclude: ['transform-async-to-generator'],
            modules: false,
            targets: {
              browsers: browserslist.development,
            },
          },
        ],
      ],
    },
    production: {
      extraBabelPlugins: [
        // "lodash",
        'transform-react-remove-prop-types',
        'transform-react-constant-elements',
      ],
      extraBabelPresets: [
        [
          'env',
          {
            debug: true,
            exclude: ['transform-async-to-generator'],
            modules: false, // required to enable tree shaking
            targets: {
              browsers: browserslist.production,
            },
            useBuiltIns: true,
          },
        ],
      ],
      hash: true,
      extraPostCSSPlugins: [
        postcssCssnext({
          browsers: browserslist.production,
        }),
        cssnano({
          autoprefixer: false,
          filterPlugins: false,
          mergeIdents: false,
          reduceIdents: false,
          zindex: false,
        }),
      ],
    },
  },
  extraBabelPlugins: [
    'syntax-dynamic-import',
    'syntax-trailing-function-commas',
    'transform-class-properties',
    'transform-object-rest-spread',
    [
      'fast-async',
      {
        useRuntimeModule: true,
      },
    ],
    ['import', {libraryName: 'antd', style: true}],
  ],
  ignoreMomentLocale: true,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
};

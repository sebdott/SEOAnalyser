// ! be advise, all config should be either change to warning or extend only rather than remove in case of obstacle

module.exports = {
  extends: [
    'plugin:promise/recommended',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:redux-saga/recommended',
    'react-app', // shareable ESLint configuration used in Create React App
    'plugin:jsx-a11y/recommended',
    'prettier', // eslint-config-google included so no need for another JavaScript StyleGuide like airbnb
    'prettier/react',
    'plugin:prettier/recommended', // for integrating this plugin with eslint-config-prettier
  ],
  plugins: [
    'no-inferred-method-name',
    'promise',
    'compat',
    'react',
    'jsx-a11y',
    'redux-saga',
    'prettier',
  ],
  globals: {
    _: false,
    initGeetest: false,
  },
  rules: {
    'compat/compat': 'warn',
    'import/namespace': ['error', {allowComputed: true}],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'tests*/**',
          'scripts/**',
          '**/*.config.js',
          '**/configs/**/*.js',
        ],
      },
    ],
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/label-has-for': ['error', {allowChildren: true}],
    'prettier/prettier': 'error',
  },
  settings: {ecmascript: 6, 'import/resolve': {extensions: ['.js', '.jsx']}},
};

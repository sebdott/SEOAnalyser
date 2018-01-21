// ! be advise, all config should be either change to warning or extend only rather than remove in case of obstacle

module.exports = {
  defaultSeverity: 'warning',
  extends: [
    'stylelint-config-property-sort-order-smacss',
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-prettier',
  ],
  plugins: [
    'stylelint-no-unsupported-browser-features',
    'stylelint-declaration-block-no-ignored-properties',
  ],
  rules: {
    'order/order': [
      'custom-properties',
      'dollar-variables',
      'at-variables',
      'less-mixins',
      'declarations',
      {
        type: 'rule',
        selector: /^&:[\w-]+$/,
      },
      {
        type: 'rule',
        selector: /^&:[\w-]+\(.+\)?/,
      },
      {
        type: 'rule',
        selector: /^&::[\w-]+$/,
      },
      {
        type: 'rule',
        selector: /^&/,
      },
      'at-rules',
    ],
    'plugin/declaration-block-no-ignored-properties': true,
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
      },
    ],
  },
};

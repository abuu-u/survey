/** @type {import('stylelint').Config} */
import recessConfig from 'stylelint-config-recess-order'

const recessConfigWithEmptyLine = recessConfig.rules[
  'order/properties-order'
].map((group) => {
  return {
    ...group,
    emptyLineBefore: 'always',
  }
})

export default {
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  plugins: ['stylelint-selector-bem-pattern'],
  rules: {
    'declaration-no-important': true,
    'order/properties-order': recessConfigWithEmptyLine,
    'declaration-empty-line-before': [
      'never',
      {
        ignore: [
          'after-comment',
          'after-declaration',
          'first-nested',
          'inside-single-line-block',
        ],
      },
    ],
    'plugin/selector-bem-pattern': {
      preset: 'bem',
    },
  },
}

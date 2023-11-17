// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
  printWidth: 80,
  trailingComma: 'none',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  proseWrap: 'always',
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false
      }
    },
    {
      files: '*.html',
      options: {
        parser: 'html',
        printWidth: 180
      }
    }
  ]
};

export default config;

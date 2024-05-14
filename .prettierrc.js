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
        printWidth: 120
      }
    }
  ]
};

export default config;

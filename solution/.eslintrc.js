const { resolve } = require("path");

module.exports = {
  env: {
    "browser": true,
    "es2021": true
  },

  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    project: resolve(__dirname, "./tsconfig.json"),
    tsconfigRootDir: __dirname,
    parser: "@typescript-eslint/parser",
  },

  plugins: ["@typescript-eslint", "prettier"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],

  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    "prettier/prettier": [
      "warn",
      {
        "singleQuote": true,
        "semi": true,
        "tabWidth": 2,
        "trailingComma": "all",
        "printWidth": 100,
        "bracketSameLine": false,
        "arrowParens": "always",
        "endOfLine": "auto"
      }
    ]
  }
}

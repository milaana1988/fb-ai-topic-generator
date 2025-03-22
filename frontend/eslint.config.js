// eslint.config.js (or eslint.config.mjs if you prefer ESM)
import tsEslintParser from "@typescript-eslint/parser";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        project: "./tsconfig.eslint.json"  // point to your lint-specific tsconfig
      }
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error"
    }
  }
];

import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  eslintPluginUnicorn.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    rules: {},
  },
];

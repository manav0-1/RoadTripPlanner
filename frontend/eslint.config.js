// import js from "@eslint/js";
// import globals from "globals";
// import pluginReact from "eslint-plugin-react";
// import json from "@eslint/json";
// import css from "@eslint/css";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
//   pluginReact.configs.flat.recommended,
//   { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
//   { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
// ]);

import js from "@eslint/js";
import react from "eslint-plugin-react";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // React 17+ ke liye
      "no-unused-vars": "warn",
      "prettier/prettier": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  prettier,
];

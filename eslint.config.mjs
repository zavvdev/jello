import globals from "globals";
import pluginJs from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import reactCompiler from "eslint-plugin-react-compiler";

var compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */

var config = [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  reactCompiler.configs.recommended,
  ...compat.config({
    extends: ["next"],
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "import/no-cycle": "error",
      "no-console": "error",
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "type", "internal"],
          pathGroups: [
            {
              pattern: "~/entity",
              group: "internal",
              position: "before",
            },
            {
              pattern: "~/infra/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "~/domain/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "~/app",
              group: "internal",
              position: "before",
            },
          ],
        },
      ],
    },
  }),
];

export default config;

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
      // "import/no-restricted-paths": [
      //   "error",
      //   {
      //     zones: [
      //       {
      //         target: "./src/entity",
      //         from: "./src/infra",
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/entity",
      //         from: [
      //           "./src/infra",
      //           "./src/domain",
      //           "./src/app",
      //           "./src/middleware.js",
      //         ],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/infra",
      //         from: ["./src/domain", "./src/app", "./src/middleware"],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/domain",
      //         from: ["./src/app", "./src/middleware"],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app",
      //         from: ["./src/middleware"],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/routes",
      //         from: [
      //           "./src/app/styles",
      //           "./src/app/i18n",
      //           "./src/app/components",
      //           "./src/app/[lng]",
      //         ],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/styles",
      //         from: [
      //           "./src/app/i18n",
      //           "./src/app/components",
      //           "./src/ui/[lng]",
      //         ],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/i18n",
      //         from: ["./src/app/components", "./src/app/[lng]"],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/components",
      //         from: ["./src/app/[lng]"],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/components/icons",
      //         from: [
      //           "./src/app/components/atoms",
      //           "./src/app/components/molecules",
      //           "./src/app/components/organisms",
      //           "./src/app/components/templates",
      //         ],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/components/atoms",
      //         from: [
      //           "./src/app/components/molecules",
      //           "./src/app/components/organisms",
      //           "./src/app/components/templates",
      //         ],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/components/molecules",
      //         from: [
      //           "./src/app/components/organisms",
      //           "./src/app/components/templates",
      //         ],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/app/components/organisms",
      //         from: ["./src/app/components/templates"],
      //         message: "Dependency prohibited",
      //       },
      //       {
      //         target: "./src/infra/database",
      //         from: ["./src/infra/services"],
      //         message: "Dependency prohibited",
      //       },
      //     ],
      //   },
      // ],
    },
  }),
];

export default config;

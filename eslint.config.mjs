import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";


export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "semi": "error",
      "no-async-promise-executor": "error",
      "no-compare-neg-zero": "error",
      "no-const-assign": "error",
      "no-constant-binary-expression": "error",
      "no-constructor-return": "error",
      "no-dupe-args": "warn",
      "no-dupe-class-members": "error",
      "no-dupe-else-if": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-func-assign": "error",
      "no-import-assign": "error",
      "no-irregular-whitespace": ["error", { "skipComments": true, "skipJSXText": true }],
      "no-loss-of-precision": "warn",
      "no-new-native-nonconstructor": "error",
      "no-promise-executor-return": ["error", { "allowVoid": true }],
      "no-self-assign": "error",
      "no-this-before-super": "error",
      "no-undef": "error",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "warn",
      "no-unsafe-negation": "error",
      "no-unused-private-class-members": "error",
      "no-unused-vars": "error",
      "use-isnan": "error",
      "camelcase": "error",
      "arrow-body-style": "error",
      "curly": "warn",
      "default-case": "error",
      "default-case-last": "error",
      "dot-notation": "error",
      "eqeqeq": "error",
      "func-name-matching": "error",
      "id-length": ["error", { "max": 20 }],
      "max-classes-per-file": ["error", 2],
      "max-depth": "error",
      "max-params": ["error", 6],
      "no-array-constructor": "error",
      "no-delete-var": "warn",
      "no-empty": "error",
      "no-empty-function": "error",
      "no-extra-boolean-cast": "error",
      "no-global-assign": "error",
      "no-invalid-this": "error",
      "no-lonely-if": "error",
      "no-negated-condition": "error",
      "no-new": "error",
      "no-param-reassign": "error",
      "no-redeclare": "error",
      "no-unused-labels": "error",
      "no-useless-catch": "error",
      "no-useless-escape": "error",
      "no-var": "error",
      "require-await": "warn",
      "require-yield": "error",
      "react/react-in-jsx-scope": "off",
      "import/no-commonjs": "off"
    }
  }
];
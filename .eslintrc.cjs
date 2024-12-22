/* eslint-disable jsdoc/check-tag-names */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/naming-convention */

/** @type {import('eslint').Linter.Config['rules']}*/
const jsdocRules = {
  "jsdoc/check-param-names": [
    "warn",
    {
      checkRestProperty: true,
    },
  ],
};

/** @type {import("eslint").Linter.Config['rules']}*/
const jsRules = {
  "no-ternary": "off",
  "sort-keys": "off",

  "func-names": ["error", "as-needed"],

  // Allow function expressions and declarations
  "func-style": "off",

  "one-var": ["error", "never"],
  "id-length": [
    "error",
    {
      min: 3,
      exceptions: ["_", "__", "id", "db", "cn", "sm", "lg", "ip", "tx"],
    },
  ],
  "sort-imports": "off",

  // Console statements are allowed in some contexts (aws lambdas)
  "no-console": "off",

  // Prefer cyclomatic complexity
  "max-statements": "off",
  "max-lines-per-function": "off",

  "no-undefined": "off",

  // Comments can be of different lengths and have different purposes
  "no-inline-comments": "off",
  "line-comment-position": "off",

  "no-warning-comments": "warn",

  "new-cap": ["error", { capIsNew: false }],

  // Prefer @typescript-eslint/naming-convention
  camelcase: "off",
};

/** @type {import('eslint').Linter.Config['rules']}*/
const tsRules = {
  "@typescript-eslint/naming-convention": ["error"],

  // Return types are evil
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",

  "@typescript-eslint/no-unused-vars": [
    "error",
    { varsIgnorePattern: "^_*$", argsIgnorePattern: "^_*$" },
  ],

  "@typescript-eslint/prefer-readonly-parameter-types": [
    "off",
    {
      ignoreInferredTypes: true,
    },
  ],

  "@typescript-eslint/sort-type-constituents": "off",

  "@typescript-eslint/no-magic-numbers": [
    "error",
    {
      enforceConst: true,
      ignoreEnums: true,
      ignore: [-1, 0, 1, 2],
      ignoreNumericLiteralTypes: true,
      ignoreReadonlyClassProperties: true,
    },
  ],

  /*
   * Disabled to allow for module augmentation
   * 'type' is still preferred
   */
  "@typescript-eslint/consistent-type-definitions": "warn",

  // Allow use of server actions in forms, onClick, etc
  "@typescript-eslint/no-misused-promises": [
    "error",
    {
      checksVoidReturn: {
        attributes: false,
      },
    },
  ],
};

/** @type {import("eslint").Linter.Config['parserOptions']}*/
const parserOptions = {
  ecmaVersion: "latest",
  sourceType: "module",
  project: true,
};

const defaultRules = Object.assign(jsRules, tsRules, jsdocRules);

/** @type {import("eslint").Linter.Config} */
const config = {
  ignorePatterns: [
    "**/old/**/*",
    "**/schema.gen*",
    "experimental",
  ],
  parserOptions,
  extends: [
    "eslint:all",
    "plugin:jsdoc/recommended-typescript",
    "plugin:@typescript-eslint/all",
    "prettier",
    "plugin:security/recommended-legacy",
  ],
  rules: defaultRules,
  overrides: [
    {
      files: ["*.[jt]sx"],
      rules: Object.assign(defaultRules, ),
    },
  ],
  globals: {
  },
};
module.exports = config;

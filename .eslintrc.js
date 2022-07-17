module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
    },
  ],
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js"],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};

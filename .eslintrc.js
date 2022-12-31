module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "xo"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  plugins: ["react"],
  rules: {
    "no-mixed-spaces-and-tabs": 0,
    "no-negated-condition": 0,
    "no-unused-vars":0
  },
};

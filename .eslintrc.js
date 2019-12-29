module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    'no-unused-vars': 0,
    'vue/no-unused-vars': 0,
    'space-infix-ops': 0,
    'object-curly-spacing': 0,
    'comma-spacing': 0,
    'no-useless-return': 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}

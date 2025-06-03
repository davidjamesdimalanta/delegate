module.exports = {
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Disable import resolution errors for MCP SDK since it uses complex exports
    'import/no-unresolved': 'off',
    // Allow any type for rapid prototyping
    '@typescript-eslint/no-explicit-any': 'warn',
    // Allow unused vars in some cases for prototyping
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}; 
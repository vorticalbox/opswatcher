module.exports = {
    env: {
      es6: true,
      node: true,
      jest: true
    },
    extends: [
      'airbnb-base',
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      // tell eslint to not require file extenstions.
      'import/extensions': 'off',
      // there is a bug in eslint for typescript that causes interfaces to incorrectly marked as unused
      // please set "noUnusedLocals": true, in tsconfig
      'no-unused-vars': 'off',
      'linebreak-style': ["error", "unix"],
      'no-underscore-dangle': 'off',
      'import/prefer-default-export': 'off',
      'no-restricted-globals': 'off'
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
  };
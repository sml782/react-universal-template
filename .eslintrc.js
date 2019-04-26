module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'eslint-config-alloy/react',
    'eslint-config-alloy/typescript',
    'prettier',
    'prettier/react'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // 检查 ES6 语法
    // parser: 'babel-eslint',
    sourceType: 'module'
  },
  plugins: [
    'import',
    'react',
    'prettier',
    '@typescript-eslint',
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    // React: false,
    // ReactDOM: false
  },
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
                                         // default to "createReactClass"
      pragma: 'React',  // Pragma to use, default to "React"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
                          // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                          // default to latest and warns if missing
                          // It will default to "detect" in the future
      flowVersion: '0.53' // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      { property: 'freeze', object: 'Object' },
      { property: 'myFavoriteWrapper' }
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { name: 'Link', linkAttribute: 'to' }
    ]
  },
  rules: {
    // 这里填入你的项目需要的个性化配置，比如：
    //
    // // @fixable 一个缩进必须用两个空格替代
    semi: ['error', 'always'],
    // 'no-console': 'off',
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none'
      }
    ],
    'max-nested-callbacks': 'off',
    'react/no-children-prop': 'off',
    'typescript/member-ordering': 'off',
    'typescript/member-delimiter-style': 'off',
    // 'react/jsx-indent-props': 'off',
    'react/no-did-update-set-state': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    'import/no-unresolved': 'off',
    '@typescript-eslint/explicit-member-accessibility': 1
  }
}

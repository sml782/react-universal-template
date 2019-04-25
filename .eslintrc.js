module.exports = {
  extends: [
    'eslint-config-alloy/react',
    'eslint-config-alloy/typescript',
    'prettier',
    'prettier/react'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react',
    'prettier',
    '@typescript-eslint/eslint-plugin'
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    // React: false,
    // ReactDOM: false
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
    'react/jsx-indent-props': 'off',
    'react/no-did-update-set-state': 'off',
    indent: [
      'off',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    'import/no-unresolved': 'off'
  }
}

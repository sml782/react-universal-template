const isEnvProduction = process.env.NODE_ENV === 'production';

module.exports = {
  // cacheDirectory: true,
  // cacheCompression: isEnvProduction,
  compact: isEnvProduction,
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    // [
    //   "@babel/preset-env",
    //   {
    //     "targets": {
    //       "browsers": [
    //         "ie > 9",
    //         "last 5 version",
    //         "> 5%",
    //         "not dead"
    //       ]
    //     },
    //     "useBuiltIns": "usage"
    //   }
    // ],
    '@babel/preset-react'
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      { legacy: true }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      { loose: true }
    ],
    // '@babel/plugin-syntax-dynamic-import',
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      }
    ]
  ]
};

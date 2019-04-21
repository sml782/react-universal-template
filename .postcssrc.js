const autoprefixer = require('autoprefixer');
// 多进程压缩css
const cssnano = require('cssnano');

module.exports = {
  // parser: 'sugarss',
  exec: true,
  // Necessary for external CSS imports to work
  // https://github.com/facebookincubator/create-react-app/issues/2677
  ident: 'postcss',
  plugins: [
    require('postcss-flexbugs-fixes'),
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9', // React doesn't support IE8 anyway
      ],
      flexbox: 'no-2009',
    }),
    cssnano({
      preset: 'default',
      autoprefixer: false,
      'postcss-zindex': false
    })
  ],
};

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const resolve = require('resolve');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// MiniCssExtractPlugin 替换 ExtractTextPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
// WorkboxWebpackPlugin 替换 SWPrecacheWebpackPlugin
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');


// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath;
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === './';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1);
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl);

// 分析
const Analysis = process.env.Analysis;

// extra plugin
const extraPlugins = [];
// 分析插件
if (Analysis) {
  extraPlugins.push(new BundleAnalyzerPlugin({
    /*
     * server - 服务模式，不生成文件
     * static - 生成html等文件
     * disabled - (generateStatsFile: true) 时 会生成JSON文件
     */
    analyzerMode: 'server',
    analyzerHost: '127.0.0.1',
    analyzerPort: 8888,
    // 自动默认浏览器打开
    openAnalyzer: true
  }));
}

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified['process.env'].NODE_ENV !== '"production"') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const miniCssExtractPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split('/').length).join('../') }
  : {};

const vendorPkg = [
  // 'antd',
  'react',
  'react-dom',
  // 'redux',
  // 'redux-thunk',
  // 'react-redux',
  // 'react-router-dom',
  // 'react-router-redux',
  // 'react-loadable',
];

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = {
  mode: 'production',
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: shouldUseSourceMap ? 'source-map' : false,
  // In production, we only want to load the polyfills and the app code.
  entry: {
    vender: vendorPkg,
    index: [require.resolve('./polyfills'), paths.appIndexJs]
  },
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ['node_modules', paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: [
      '.mjs',
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
    alias: {

      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      new TsconfigPathsPlugin({ configFile: paths.appTsProdConfig }),
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    strictExportPresence: true,
    rules: [
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|jsx|mjs)$/,
        loader: require.resolve('source-map-loader'),
        enforce: 'pre',
        include: paths.appSrc,
        exclude: /node_modules/,
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works just like "file" loader but it also embeds
          // assets smaller than specified size as data URLs to avoid requests.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            exclude: /node_modules/,
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            exclude: /node_modules/,
            loader: require.resolve('babel-loader')
          },
          // Compile .tsx?
          {
            test: /\.(ts|tsx)$/,
            include: paths.appSrc,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve('babel-loader')
              },
              {
                loader: require.resolve('ts-loader'),
                options: {
                  // disable type checker - we will use it in fork plugin
                  transpileOnly: true,
                  configFile: paths.appTsProdConfig,
                },
              },
            ],
          },
          // The notation here is somewhat confusing.
          // "postcss" loader applies autoprefixer to our CSS.
          // "css" loader resolves paths in CSS and adds assets as dependencies.
          // "style" loader normally turns CSS into JS modules injecting <style>,
          // but unlike in development configuration, we do something different.
          // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
          // (second argument), then grabs the result CSS and puts it into a
          // separate file in our build process. This way we actually ship
          // a single CSS file in production instead of JS code injecting <style>
          // tags. If you use code splitting, however, any async bundles will still
          // use the "style" loader inside the async code so CSS from them won't be
          // in the main CSS file.
          {
            test: /\.(css|less)$/,
            // exclude: /node_modules/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: miniCssExtractPluginOptions
              },
              {
                loader: require.resolve('css-loader'),
                // options: {
                //   importLoaders: 1,
                //   minimize: true,
                //   sourceMap: shouldUseSourceMap,
                // },
              },
              {
                loader: require.resolve('postcss-loader'),
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  javascriptEnabled: true
                }
              }
            ],
            sideEffects: true,
          },
          // "file" loader makes sure assets end up in the `build` folder.
          // When you `import` an asset, you get its filename.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /node_modules/],
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ],
      },
    ],
  },
  optimization: {
    // 编译出错时， true - 跳过
    noEmitOnErrors: true,
    // 包含所有入口文件的
    runtimeChunk: {
      name: 'runtime'
    },
    // 生成chunk并缓存
    splitChunks: {
      // 决定生成什么文件
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      // name: true 自动为文件生成
      name: true,
      // 自动生成文件名的连接符
      automaticNameDelimiter: '~',
      // 缓存组
      cacheGroups: {
        // 禁用默认
        default: false,
        // react 单独拿出去
        // reactBase: {
        //   name: 'react_base',
        //   test: (module) => {
        //     return /react|react-dom|prop-types/.test(module.context);
        //   },
        //   chunks: 'initial',
        //   priority: 10,
        // },
        common: {
          name: 'common',
          chunks: 'initial',
          priority: 10,
          reuseExistingChunk: false,
          test: /[\\/]node_modules[\\/]/,
          // test: (module, chunks) => {
          //   const isant = /ant/.test(module.context);
          //   if (isant) {
          //     // console.log(module.context);
          //   }
          //   // console.log(/ant/.test(module.context));
          //   return (/[\\/]node_modules[\\/]/.test(module.context));
          // },
          // minChunks: 2,
        },
        styles: {
          name: true,
          test: /\.(css|less)$/,
          // chunks: 'all',
          chunks: 'initial',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    },
    minimize: true,
    // 压缩插件
    minimizer: [
      // Minify the code.
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want uglify-js to parse ecma 8 code. However we want it to output
            // ecma 5 compliant code, to avoid issues with older browsers, this is
            // whey we put `ecma: 5` to the compress and output section
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Don't inline functions with arguments, to avoid name collisions:
            // https://github.com/mishoo/UglifyJS2/issues/2842
            inline: 1,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: shouldUseSourceMap,
      }), // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
      new MiniCssExtractPlugin({
        filename: cssFilename
      }),
    ]
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
    new webpack.DefinePlugin(env.stringified),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: publicPath,
      generate: (seed, files) => {
        const manifestFiles = files.reduce(function(manifest, file) {
          manifest[file.name] = file.path;
          return manifest;
        }, seed);

        return {
          files: manifestFiles,
        };
      },
    }),
    // Generate a service worker script that will precache, and keep up to date,
    // the HTML & assets that are part of the Webpack build.
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      importWorkboxFrom: 'cdn',
      navigateFallback: publicUrl + '/index.html',
      navigateFallbackBlacklist: [
        // Exclude URLs starting with /_, as they're likely an API call
        new RegExp('^/_'),
        // Exclude URLs containing a dot, as they're likely a resource in
        // public/ and not a SPA route
        new RegExp('/[^/]+\\.[^/]+$'),
      ],
    }),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Perform type checking and linting in a separate process to speed up compilation
    new ForkTsCheckerWebpackPlugin({
      typescript: resolve.sync('typescript', {
        basedir: paths.appNodeModules,
      }),
      async: false,
      silent: true,
      useTypescriptIncrementalApi: true,
      checkSyntacticErrors: true,
      tsconfig: paths.appTsProdConfig,
      tslint: paths.appTsLint,
      formatter: typescriptFormatter,
      reportFiles: [
        '**',
        '!**/__tests__/**',
        '!**/?(*.)(spec|test).*',
        '!**/src/setupProxy.*',
        '!**/src/setupTests.*',
      ],
    }),
    /** 进度插件 start **/
    new ProgressBarPlugin({
      format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false
    }),
    // new webpack.ProgressPlugin((percentage, msg) => {
    //   const stream = process.stderr;
    //   console.log(percentage);
    //   if (stream.isTTY && percentage < 0.71) {
    //     stream.cursorTo(0);
    //     stream.write(`📦   ${msg}`);
    //     stream.clearLine(1);
    //   }
    // }),
    /** 进度插件 end **/
    ...extraPlugins
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
};

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import WebpackRequireFrom from 'webpack-require-from';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import WriteFilePlugin from 'write-file-webpack-plugin';

export const loadImages = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg|gif)$/,
        include,
        exclude,
        use: [{ loader: 'url-loader', options }]
      }
    ]
  }
});

export const loadFonts = ({ include, exclude, options, loader }) => ({
  module: {
    rules: [
      {
        test: /\.(eot|ttf|woff|woff2)(\?.+)?$/,
        include,
        exclude,
        use: [{ loader: loader, options }]
      }
    ]
  }
});

export const loadJavaScript = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  }
});

export const loadTypescript = ({ include, exclude }) => ({
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts(x)?)$/,
        include,
        exclude,
        use: ['babel-loader?cacheDirectory', 'ts-loader']
      }
    ]
  }
});

export const buildCSS = ({ include, exclude } = {}) => {
  const plugin = new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].[hash].css'
  });

  return {
    module: {
      rules: [
        {
          include,
          exclude,
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        }
      ]
    },
    plugins: [plugin]
  };
};

export const serveCSS = () => {
  const plugin = new ExtractTextPlugin({
    filename: '[name].css',
    allChunks: true
  });

  return {
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: ['css-hot-loader'].concat(
            plugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', 'sass-loader']
            })
          )
        }
      ]
    },
    plugins: [plugin]
  };
};

export const generateSourceMaps = ({ type }) => ({
  devtool: type
});

export const clean = filepath => ({
  plugins: [
    new CleanWebpackPlugin([filepath], {
      root: path.resolve(__dirname, '..')
    })
  ]
});

export const showBuildStats = () => ({
  stats: {
    modules: false,
    hash: false,
    assetsSort: '!size',
    version: false,
    children: false,
    env: true,
    builtAt: false
  }
});

export const minimize = () => ({
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        parallel: true,
        cache: true,
        uglifyOptions: {
          compress: false,
          mangle: true
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          zindex: false
        }
      })
    ]
  }
});

export const optimizeLodash = () => ({
  plugins: [new LodashModuleReplacementPlugin()]
});

export const setPublicPath = () => ({
  plugins: [
    new WebpackRequireFrom({
      methodName: '__WEBPACK_ASSETS_PATH__'
    })
  ]
});

export const devServer = ({ contentBase }) => ({
  output: { publicPath: 'https://127.0.0.1:8080/assets/' },
  devServer: {
    historyApiFallback: true,
    overlay: { errors: true, warnings: false },
    https: true,
    publicPath: '/assets/',
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchOptions: { ignored: /node_modules/ },
    progress: true,
    hot: false,
    inline: false
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new WriteFilePlugin({
      test: /sw\.js$/
    })
  ]
});

export const createAssetsLoadingHTML = ({ template, dest }) => ({
  plugins: [
    new HtmlWebpackPlugin({
      filename: dest,
      template,
      inject: false,
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
});

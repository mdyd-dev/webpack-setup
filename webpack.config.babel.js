import path from 'path';
import merge from 'webpack-merge';
import * as parts from './__webpack/webpack.parts.js';

const SOURCE_PATH = path.join(__dirname, 'src');
const SCRIPTS_PATH = path.join(SOURCE_PATH, 'scripts');
const STYLES_PATH = path.join(SOURCE_PATH, 'styles');

const PATH_BUILD = path.join(
  __dirname,
  'marketplace_builder',
  'assets',
  'autogenerated'
);

const DEV_ASSETS_HTML_TEMPLATE = path.join(
  __dirname,
  '__webpack',
  'dev_assets_template.ejs'
);

const PROD_ASSETS_HTML_TEMPLATE = path.join(
  __dirname,
  '__webpack',
  'prod_assets_template.ejs'
);

const ASSETS_PARTIAL_OUTPUT = path.join(
  __dirname,
  'marketplace_builder',
  'views',
  'partials',
  'shared',
  'assets',
  'generated.liquid'
);

// Common
const commonConfig = merge([
  {
    entry: {
      index: path.join(SCRIPTS_PATH, 'index.ts')
    },
    output: {
      path: PATH_BUILD,
      filename: '[name].js',
      chunkFilename: '[name].[chunkhash:8].js'
    }
  },
  parts.loadTypescript({
    include: SCRIPTS_PATH
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[hash:8].[ext]'
    }
  }),
  parts.showBuildStats()
]);

// Development
const developmentConfig = merge([
  {
    mode: 'development'
  },
  parts.serveCSS(),
  parts.devServer({
    contentBase: PATH_BUILD
  }),
  parts.createAssetsLoadingHTML({
    template: DEV_ASSETS_HTML_TEMPLATE,
    dest: ASSETS_PARTIAL_OUTPUT
  }),
  parts.generateSourceMaps({ type: 'cheap-module-eval-source-map' }),
  parts.loadFonts({
    loader: 'url-loader'
  })
]);

// Production
const productionConfig = merge([
  parts.clean(PATH_BUILD),
  {
    mode: 'production'
  },
  parts.buildCSS(),
  parts.generateSourceMaps({ type: 'source-map' }),
  parts.minimize(),
  parts.optimizeLodash(),
  parts.createAssetsLoadingHTML({
    template: PROD_ASSETS_HTML_TEMPLATE,
    dest: ASSETS_PARTIAL_OUTPUT
  }),
  parts.loadFonts({
    loader: 'file-loader',
    options: {
      name: '[name].[hash:8].[ext]',
      publicPath: '.'
    }
  }),
  parts.setPublicPath()
]);

module.exports = env => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};

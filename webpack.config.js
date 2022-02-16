const path = require('path')
// const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  }
  if (isProd) config.minimizer = [new TerserPlugin()]
  return config
}

const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[fullhash].${ext}`)

const babelLoader = (preset) => {
  const loader = {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env'],
    },
  }
  if (preset) loader.options.presets.push(preset)
  return loader
}

const plugins = () => {
  const plugins = [
    new ESLintPlugin()
  ]
  if (isProd) plugins.push(new BundleAnalyzerPlugin())
  return plugins
}

module.exports = {
  target: 'node',
  externals: [/node_modules/, 'bufferutil', 'utf-8-validate'],
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './app.js'],
  },
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
  devtool: false,
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: babelLoader(),
      },
    ],
  },
}

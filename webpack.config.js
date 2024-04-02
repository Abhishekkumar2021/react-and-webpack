const path = require('path')
const network = require('os').networkInterfaces();
const HtmlWebpackPlugin = require('html-webpack-plugin')

class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('MyPlugin', (stats) => {
      // clear the terminal
      console.log('\x1Bc')

      // get the errors and warnings
      const { errors, warnings } = stats.compilation

      // if there are no errors and warnings, log success in green
      if (!errors.length && !warnings.length) {
        console.log('\x1b[32m', 'Compiled successfully!')
      }

      // if there are errors, log them in red
      if (errors.length) {
        console.log('\x1b[31m', 'Failed to compile.\n')
        errors.forEach((message) => {
          console.log(message.message || message)
          console.log()
        })
        return
      }

      // if there are warnings, log them in yellow
      if (warnings.length) {
        console.log('\x1b[33m', 'Compiled with warnings.\n')
        warnings.forEach((message) => {
          console.log(message.message || message)
          console.log()
        })
      }

      // reset the color
      console.log('\x1b[0m')

      // log the url to open the project by getting the port from the devServer options
      const { port } = compiler.options.devServer
      const ip = network['Wi-Fi'].find(({ family }) => family === 'IPv4').address
      console.log(`\n You can now view the project in the browser.\n\n Local: http://localhost:${port}\n On Your Network: http://${ip}:${port}\n`)

      // log the time it took to compile
      console.log(` Compiled in ${stats.endTime - stats.startTime}ms`)
    })
  }
}

const config = {
  stats: 'errors-only',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.ts'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: false,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
    }),
    new MyPlugin(),
  ],
}

module.exports = config
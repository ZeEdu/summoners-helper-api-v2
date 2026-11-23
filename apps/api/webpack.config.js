const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin')
const { join } = require('path')

// eslint-disable-next-line @nx/enforce-module-boundaries -- Webpack config reads root package metadata.
const rootPackageJson = require('../../package.json')

// Keep third-party runtime dependencies external.
// Workspace libraries such as @org/contracts will be bundled.
const externalDependencies = Object.keys(rootPackageJson.dependencies ?? {})

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
    clean: true,
    ...(!isProduction && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',

      buildLibsFromSource: true,
      externalDependencies,

      assets: [
        './src/assets',
        {
          input: './src/app/i18n',
          glob: '**/*',
          output: 'i18n',
        },
      ],

      optimization: isProduction,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: !isProduction,
    }),
  ],
}

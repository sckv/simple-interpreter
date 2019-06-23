const path = require('path');

module.exports = api => {
  const BUILD_DIR = path.join(process.cwd(), 'build');

  api.cache(true);

  const presets = [['@babel/preset-env', { targets: { node: process.versions.node } }]];
  const plugins = [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cacheDirectory: true,
        cwd: path.resolve(BUILD_DIR),
        root: '.',
        extensions: ['.js'],
        alias: {
          '^@(.+)': './\\1',
        },
      },
    ],
  ];

  return {
    presets,
    plugins,
  };
};

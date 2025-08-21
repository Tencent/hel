module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: [['@babel/plugin-transform-class-properties', { loose: true }]],
};

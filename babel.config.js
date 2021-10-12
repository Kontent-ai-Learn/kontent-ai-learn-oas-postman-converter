module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-strict-mode',
    'babel-plugin-styled-components',
  ],
  presets: [
    [
      '@babel/preset-env', {
      bugfixes: true,
      useBuiltIns: 'usage',
      corejs: {
        version: 3,
        proposals: true,
      },
    },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        isTSX: true,
      },
    ],
    [
      '@babel/preset-react', {
      runtime: 'automatic',
    },
    ],
  ],
};

'use strict';

const React = require('react');
const ReactDOMServer = require('react-dom/server');

function purgeCache(modulePath) {
  const resolvedPath = require.resolve(modulePath)
  const module = require.cache[resolvedPath]
  if (!module) {
    return;
  }
  module.children.forEach(child => {
    purgeCache(child.id);
  })

  delete require.cache[resolvedPath]
}

require('@babel/register')({
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic'
      }
    ]
  ],
  presets: [
    ['@babel/preset-env', { targets: { node: true } }],
    '@babel/preset-typescript'
  ]
});

function compile(data) {
  const path = data.path
  return function render(locals) {
    const Component = require(path);
    purgeCache(path);
    const element = React.createElement(Component.default || Component, locals);
    let renderedHTML = ReactDOMServer.renderToStaticMarkup(element);

    if (renderedHTML.slice(0, 5).toLowerCase() === '<html') {
      renderedHTML = '<!DOCTYPE html>' + renderedHTML;
    }

    return renderedHTML;
  };
}

module.exports = compile;

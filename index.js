/* global hexo */

'use strict';

const compile = require('./lib/compile');

function renderer(data, locals) {
  return compile(data)(locals);
}

renderer.compile = compile;
renderer.disableNunjucks = false;

hexo.extend.renderer.register('jsx', 'html', renderer, true);
hexo.extend.renderer.register('tsx', 'html', renderer, true);

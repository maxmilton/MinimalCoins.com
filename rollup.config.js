/* eslint-disable max-len */// tslint:disable:max-line-length

import browserSync from 'browser-sync';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import historyApiFallback from 'connect-history-api-fallback';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const bs = browserSync.create();

const isProd = process.env.NODE_ENV === 'production' || !process.env.ROLLUP_WATCH;

const terserOpts = {
  compress: {
    drop_console: isProd,
    drop_debugger: isProd,
    negate_iife: false, // better performance when false
    passes: 2,
    pure_getters: true,
    unsafe: true,
    unsafe_proto: true,
  },
  mangle: {
    properties: {
      // Bad patterns: children, nodeName, pathname, previous
      regex: /^(__.*|state|actions|attributes|isExact|exact|subscribe|detail|params|render|oncreate|onupdate|onremove|ondestroy)$/,
      // debug: 'XX',
    },
  },
  output: {
    comments: !!process.env.DEBUG,
    wrap_iife: true,
  },
  ecma: 8,
  toplevel: true,
  warnings: !!process.env.DEBUG,
};

// custom browser sync plugin
function browsersync() {
  if (!bs.active) {
    bs.init({
      server: {
        baseDir: 'dist',
        directory: true,
        middleware: [historyApiFallback()],
      },
      port: process.env.PORT || 1234,
      open: false,
      ghostMode: false,
      logConnections: true,
    });
  }

  return {
    name: 'browsersync',
    onwrite(bundle) {
      bs.reload(bundle.dest);
    },
  };
}

export default {
  input: 'src/index.js',
  experimentalCodeSplitting: true,
  experimentalDynamicImport: true,
  output: {
    file: 'dist/mc.js',
    name: 'mc',
    format: 'iife',
    sourcemap: isProd,
    interop: false, // saves bytes with externs
  },
  plugins: [
    postcss({
      extract: true,
      sourceMap: true,
    }),
    commonjs(),
    resolve({
      jsnext: true,
      extensions: ['.js', '.jsx', '.json', '.css'],
    }),
    buble({ jsx: 'h' }),

    // PRODUCTION
    isProd && terser(terserOpts),

    // TODO: Asset cache invalidation

    // TODO: Service worker & other nice PWA features (necessary?)
    //  ↳ https://github.com/GoogleChrome/workbox
    //  ↳ https://developers.google.com/web/tools/workbox/

    // DEVELOPMENT
    !isProd && browsersync(),
  ],
};

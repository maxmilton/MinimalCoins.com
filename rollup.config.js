// TODO: Remove unused CSS; https://www.purgecss.com/

import { readFileSync, writeFile } from 'fs';
import preprocessMarkup from '@minna-ui/svelte-preprocess-markup';
import preprocessStyle from '@minna-ui/svelte-preprocess-style';
import replace from 'rollup-plugin-replace';
import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import { terser } from 'rollup-plugin-terser';
import CleanCSS from 'clean-css';

const template = readFileSync(`${__dirname}/src/template.html`, 'utf8');
const isProd = !process.env.ROLLUP_WATCH;
const nameCache = {};

// NOTE: Fragile; needs attention, especially between Svelte releases.
const sveltePropRe = /^(_.*|each_value.*|component|changed|previous|destroy|root|fire)$/;

const terserOpts = {
  compress: {
    drop_console: isProd,
    drop_debugger: isProd,
    negate_iife: false, // better chrome performance when false
    passes: 2,
    pure_getters: true,
    unsafe: true,
    unsafe_arrows: true,
    unsafe_comps: true,
    unsafe_Function: true,
    unsafe_math: true,
    unsafe_methods: true,
    unsafe_proto: true,
    unsafe_regexp: true,
    unsafe_undefined: true,
    // hoist_funs: true, // sometimes makes compressed output bigger
  },
  mangle: {
    properties: {
      regex: sveltePropRe,
    },
  },
  output: {
    comments: !!process.env.DEBUG,
    wrap_iife: true,
  },
  nameCache,
  ecma: 8,
  module: true,
  toplevel: true,
  warnings: !!process.env.DEBUG,
};

const terserOptsSafe = {
  compress: {
    drop_console: isProd,
    drop_debugger: isProd,
    passes: 2,
    pure_getters: true,
    // hoist_funs: true, // sometimes makes compressed output bigger
  },
  mangle: {
    properties: {
      regex: sveltePropRe,
    },
  },
  output: {
    comments: !!process.env.DEBUG,
  },
  nameCache,
  ecma: 5,
  toplevel: true,
  warnings: !!process.env.DEBUG,
};

const cleanCssOpts = {
  level: {
    1: { all: true },
    2: { all: true },
  },
};

/**
 * Generic error handler for nodejs callbacks.
 * @param {Error} err
 */
function catchErr(err) { if (err) throw err; }

/**
 * Ultra-minimal template engine.
 * @see https://github.com/Drulac/template-literal
 * @param {string} html A HTML template to compile.
 * @returns {Function}
 */
function compileHtml(html) {
  return new Function('d', 'return `' + html + '`'); // eslint-disable-line
}

const makeHtml = compileHtml(template);

export default [
  {
    input: 'src/main.js',
    output: {
      sourcemap: !isProd,
      format: 'es',
      name: 'm',
      file: 'public/m.js',
    },
    plugins: [
      replace({
        delimiters: ['%', '%'],
        values: {
          APP_RELEASE: process.env.APP_RELEASE,
        },
      }),
      svelte({
        dev: !isProd,
        preprocess: {
          // only remove whitespace in production; better feedback during development
          ...(isProd ? { markup: preprocessMarkup({ unsafe: true }) } : {}),
          style: preprocessStyle(),
        },
        css: (css) => {
          const cssCode = isProd
            ? new CleanCSS(cleanCssOpts).minify(css.code).styles
            : css.code;

          // compile HTML from template
          writeFile(`${__dirname}/public/index.html`, makeHtml({
            title: 'Minimal Coins',
            content: `<style>${cssCode}</style><script src=m.js type=module async></script><script src=i.js nomodule async></script>`,
          }).trim(), catchErr);
        },
      }),
      resolve(),
      commonjs(),
      // buble(),
      isProd && terser(terserOpts),
    ],
  },
  {
    input: 'src/main.js',
    output: {
      sourcemap: !isProd,
      format: 'iife',
      name: 'i',
      file: 'public/i.js',
    },
    plugins: [
      replace({
        delimiters: ['%', '%'],
        values: {
          APP_RELEASE: process.env.APP_RELEASE,
        },
      }),
      svelte({
        dev: !isProd,
        preprocess: {
          // only remove whitespace in production; better feedback during development
          ...(isProd ? { markup: preprocessMarkup({ unsafe: true }) } : {}),
          style: () => {}, // noop
        },
      }),
      resolve(),
      commonjs(),
      buble(),
      isProd && terser(terserOptsSafe),
    ],
  },
];

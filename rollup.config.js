import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

function banner() {
  var text = pkg.name + ' v' + pkg.version + '\n';
  text += 'Copyright (c) ' + (new Date).getFullYear() + ' Erik Koopmans\n';
  text += 'Optimize by Allen He ' + (new Date).getFullYear() + '\n';
  text += 'Released under the ' + pkg.license + ' License.';
  text = '/**\n * ' + text.replace(/\n/g, '\n * ') + '\n */';
  return { banner: text };
}

export default [
  // Un-bundled builds.
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs', inlineDynamicImports: true },
      { file: pkg.module, format: 'es', inlineDynamicImports: true },
    ],
    external: [
      'es6-promise',
      'jspdf',
      'html2canvas',
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
        'process.env.NODE_ENV': JSON.stringify('production')
        }
      }),
      babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
      banner()
    ]
  },
  // Bundled builds (minified).
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.browser,
        inlineDynamicImports: true,
        format: 'umd',
        name: 'html2pdf',
        globals: {
          'es6-promise': 'es6promise',
          jspdf: 'jsPDF',
          html2canvas: 'html2canvas'
        }
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
        'process.env.NODE_ENV': JSON.stringify('production')
        }
      }),
      babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
      terser({
        output: { preamble: banner().banner }
      })
    ]
  }
];

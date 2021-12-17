import path from 'path';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
// resolve将我们编写的源码与依赖的第三方库进行合并
import resolve from 'rollup-plugin-node-resolve';
// 解决rollup.js无法识别CommonJS模块
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
// import pkg from "./package.json";
import autoExternal from 'rollup-plugin-auto-external';
import progress from 'rollup-plugin-progress';
import visualizer from 'rollup-plugin-visualizer';
// import filesize from 'rollup-plugin-filesize';

const root = process.cwd();
const pkg = require(path.resolve(root, './package.json'));

const outputMap = {
  cjs: {
    file: path.resolve(__dirname, pkg.main),
    format: 'cjs',
    sourcemap: true,
  },
  esm: {
    file: path.resolve(__dirname, pkg.module),
    format: 'es',
  },
  umd: {
    name: 'z',
    file: path.resolve(__dirname, pkg.unpkg),
    format: 'umd',
    sourcemap: true,
  },
};
module.exports = ['cjs', 'esm', 'umd'].map((format) => {
  return {
    input: path.resolve(root, './src/index.ts'),
    output: outputMap[format],
    external: [/@babel\/runtime/],
    plugins: [
      progress(),
      resolve({
        // 将自定义选项传递给解析插件
        customResolveOptions: {
          moduleDirectory: 'node_modules',
        },
      }),
      // 将 CommonJS 转换成 ES2015 模块
      commonjs(),
      autoExternal({
        builtins: false,
        dependencies: true,
        packagePath: path.resolve(root, './package.json'),
        peerDependencies: true,
      }),

      typescript(),
      babel({
        // babelHelpers: 'bundled',
        // babelHelpers: false,
        runtimeHelpers: format == 'umd' ? 'inline' : 'runtime',
        // babelHelpers: format == 'umd' ? 'inline' : 'runtime',
        exclude: 'node_modules/**',
        extensions: ['.tsx', '.ts', '.js'],
        presets: [
          [
            '@babel/preset-env',
            {
              loose: true,
              modules: false,
              targets: {
                browsers: ['last 2 versions', 'IOS >= 9', 'Android >= 5'],
              },
            },
          ],
          ['@babel/react', { pragma: 'createElement' }],
          [
            '@babel/typescript',
            {
              isTSX: true,
              allExtensions: true,
              onlyRemoveTypeImports: true,
            },
          ],
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              corejs: 3,
              useESModules: format == 'esm',
              helpers: format != 'umd',
            },
          ],
          [
            '@babel/plugin-proposal-class-properties',
            {
              loose: true,
            },
          ],
        ],
      }),
      json(),

      // terser()
      visualizer(),
      // filesize(),
    ],
    // external: ['rax']
  };
});

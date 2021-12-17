/* eslint-disable @typescript-eslint/no-var-requires */
const less = require("gulp-less");
// const sass = require("gulp-sass");
const gulp = require("gulp");
const fs = require("fs-extra");
const babel = require("gulp-babel");
// const babelConf = require("./babel.config.js");
// const replace = require("gulp-replace");
const postcss = require("gulp-postcss");

const { series, parallel } = gulp;
// runWebpack('./webpack.config.one')(true);
const destDir = `./dist`;
// const destReactEsDir = `../react/es`;
// const destReactLibDir = `../react/lib`;
// const destGenDir = `../dist/es`;
// const destGenLibDir = `../dist/lib`;
const postcssPlugins = [
  require("postcss-px-to-viewport")({
    unitToConvert: "rpx",
    viewportWidth: 750, // 对应设计图的宽度，用于计算 vw。默认 750
    unitPrecision: 4, // 计算结果的精度，默认 5
    minPixelValue: 0,
    viewportUnit: "vw",
    fontViewportUnit: "vw", // vmin is more suitable.
    // exclude: ['download'],
    mediaQuery: false,
    landscapeWidth: 2000,
    landscapeUnit: "vw",
    landscape: true,
    // selectorBlackList: [/.*?horizontal.*/],
  }),
  require("autoprefixer")(),
  require("postcss-preset-env")(),
  require("cssnano")(),
];
const generateJs = () => {
  return gulp
    .src(["./src/**/*.{ts,tsx}", "./src/*.{ts,tsx}"])
    .pipe(
      babel()
      // babel({
      //   babelrc: false,
      //   ...babelConf(),
      // })
    )
    .pipe(gulp.dest(destDir));
};
// const generateReactJs = () => {
//   return gulp
//     .src(["../src/**/*.{ts,tsx}", "../src/index.ts"])
//     .pipe(
//       babel({
//         babelrc: false,
//         ...babelConf(true, true),
//       })
//     )
//     .pipe(gulp.dest(destReactEsDir));
// };
// const generateJs = () => {
//   return gulp
//     .src(["../src/**/*.{ts,tsx}", "../src/index.ts"])
//     .pipe(
//       babel({
//         babelrc: false,
//         ...babelConf(false, true),
//       })
//     )
//     .pipe(gulp.dest(destGenDir));
// };
// const generateLibJs = () => {
//   return gulp
//     .src(["../src/**/*.{ts,tsx}", "../src/index.ts"])
//     .pipe(
//       babel({
//         babelrc: false,
//         ...babelConf(false, false),
//       })
//     )
//     .pipe(gulp.dest(destGenLibDir));
// };
const copySourceOther = () => {
  return gulp
    .src([`./src/**/!(*.js|*.jsx|*.ts|*.tsx|*.scss|*.less|*.json)`])
    .pipe(gulp.dest(destDir));
};

const cssRpx2Rem = (path, dest) => () => {
  return (
    gulp
      .src(path)
      .pipe(less())
      .pipe(postcss(postcssPlugins))
      // .pipe(
      //   replace(/(\d+)rpx/g, (match, p1) => {
      //     return `${parseFloat((Number(p1) * 100) / 750)}vw`;
      //   })
      // )
      .pipe(gulp.dest(dest))
  );
};
// const sassRpx2Rem = (path, dest) => () => {
//   return (
//     gulp
//       .src(path)
//       .pipe(sass())
//       .pipe(postcss(postcssPlugins))
//       // .pipe(
//       //   replace(/(\d+)rpx/g, (match, p1) => {
//       //     return `${parseFloat((Number(p1) * 100) / 750)}vw`;
//       //   })
//       // )
//       .pipe(gulp.dest(dest))
//   );
// };
function clean(done) {
  fs.removeSync(destDir);
  done();
}
const sourceBuild = parallel(
  generateJs,
  cssRpx2Rem(`./src/**/*.{css,less}`, destDir),
  copySourceOther,
);

exports.default = series(
  clean,
  sourceBuild,
);

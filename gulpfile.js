// Initialize modules
const { src, dest, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const purgecss = require("gulp-purgecss");
const replace = require("gulp-replace");

// Define file paths
const paths = {
  src: {
    styles: "assets/scss/**/*.scss",
    html: "*.html",
  },
  dist: {
    styles: "dist/css",
  },
};

// Development tasks
function compileSass() {
  return src(paths.src.styles, { sourcemaps: true })
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(paths.dist.styles, { sourcemaps: "." }));
}

function watchFiles() {
  watch(paths.src.styles, compileSass);
}

// Deployment tasks
function optimizeStyles() {
  return src(paths.dist.styles + "/*.css")
    .pipe(purgecss({ content: [paths.src.html] }))
    .pipe(dest(paths.dist.styles));
}

function cacheBust() {
  const cbString = new Date().getTime();
  return src(paths.src.html)
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

exports.dev = series(compileSass, watchFiles);

exports.build = series(compileSass, optimizeStyles, cacheBust);

exports.default = series(exports.dev);

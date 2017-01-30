'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCss = require('gulp-clean-css');
var prefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var frontSrcDir = path.join(__dirname, '/app/front');
var frontStylesDir = path.join(frontSrcDir, '/styles');

var publicDir = path.join(__dirname, '/public');
var publicStylesDir = path.join(publicDir, '/styles');
var publicFontsDir = path.join(publicDir, '/fonts');
var publicAssetsDir = path.join(publicDir, '/assets');

var nodeModulesDir = path.join(__dirname, '/node_modules');

gulp.task('default', [
  'styles',
  'assets'
]);

// Styles

gulp.task('styles', [
  'styles.application',
  'styles.embedded',
  'styles.vendor'
]);

gulp.task('styles.application', function() {
  var files = [
    path.join(frontStylesDir, '/styles.less')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer({browsers: ['last 4 versions']}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('styles.embedded', function() {
  var files = [
    path.join(frontStylesDir, '/embedded.less')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer({browsers: ['last 4 versions']}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat('embedded.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('styles.vendor', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/css/font-awesome.min.css'),
    path.join(nodeModulesDir, '/os-bootstrap/dist/css/os-bootstrap.min.css'),
    path.join(nodeModulesDir, '/angular/angular-csp.css'),
    path.join(nodeModulesDir, '/babbage.ui/dist/babbage.css')
  ];
  return gulp.src(files)
    .pipe(concat('vendor.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest(publicStylesDir));
});

// Assets

gulp.task('assets', [
  'assets.fonts',
  'assets.application',
  'assets.favicon'
]);

gulp.task('assets.fonts', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/fonts/*'),
    path.join(nodeModulesDir, '/os-bootstrap/dist/fonts/*')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(publicFontsDir));
});

gulp.task('assets.application', function() {
  return gulp.src([
      path.join(nodeModulesDir,
        '/os-bootstrap/dist/assets/os-branding/vector/light/os.svg'),
      path.join(nodeModulesDir,
        '/os-bootstrap/dist/assets/os-branding/vector/light/viewer.svg'),
      path.join(nodeModulesDir,
        '/os-bootstrap/dist/assets/os-branding/vector/light/osviewer.svg')
  ])
    .pipe(gulp.dest(publicAssetsDir));
});

gulp.task('assets.favicon', function() {
  var files = [
    path.join(nodeModulesDir,
      '/os-bootstrap/dist/assets/os-branding/viewer-favicon.ico')
  ];
  return gulp.src(files)
    .pipe(rename('favicon.ico'))
    .pipe(gulp.dest(publicDir));
});

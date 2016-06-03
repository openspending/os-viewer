'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var resolve = require('resolve');
var _ = require('lodash');

var frontSrcDir = path.join(__dirname, '/app/front');
var frontScriptsDir = path.join(frontSrcDir, '/scripts');
var frontStylesDir = path.join(frontSrcDir, '/styles');

var publicDir = path.join(__dirname, '/app/public');
var publicScriptsDir = path.join(publicDir, '/');
var publicStylesDir = path.join(publicDir, '/styles');
var publicFontsDir = path.join(publicDir, '/fonts');
var publicAssetsDir = path.join(publicDir, '/assets');

var nodeModulesDir = path.join(__dirname, '/node_modules');

var modules = [
  'jquery',
  'lodash',
  'bluebird',
  'marked'
];

gulp.task('default', [
  'app.scripts',
  'app.modules',
  'app.styles',
  'app.favicon',
  'embedded.styles',
  'app.assets',
  'vendor.scripts',
  'vendor.styles',
  'vendor.fonts'
]);

gulp.task('app.scripts', function() {
  var files = [
    path.join(frontScriptsDir, '/application.js'),
    path.join(frontScriptsDir, '/config/*.js'),
    path.join(frontScriptsDir, '/controllers/*.js'),
    path.join(frontScriptsDir, '/directives/*.js'),
    path.join(frontScriptsDir, '/filters/*.js'),
    path.join(frontScriptsDir, '/services/*.js'),
    path.join(frontScriptsDir, '/animations/*.js')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.modules', function() {
  var bundler = browserify({});
  bundler.external('webpack-raphael');

  _.forEach(modules, function (id) {
    bundler.require(resolve.sync(id), {expose: id});
  });

  bundler.require(resolve.sync('./app/front/scripts/components'), {expose: 'components'});

  bundler.add(path.join(frontScriptsDir, '/modules.js')); // Init modules

  return bundler.bundle()
    .pipe(source('modules.js'))
    .pipe(buffer())
//    .pipe(uglify())
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.styles', function() {
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

gulp.task('embedded.styles', function() {
  var files = [
    path.join(nodeModulesDir, '/babbage.ui/dist/lib.css'),
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


gulp.task('vendor.scripts', function() {
  var files = [
    path.join(nodeModulesDir, '/file-saver/FileSaver.js'),
    path.join(nodeModulesDir, '/js-polyfills/xhr.js'),
    path.join(nodeModulesDir, '/os-bootstrap/dist/js/bootstrap.min.js'),
    path.join(nodeModulesDir, '/angular/angular.min.js'),
    path.join(nodeModulesDir, '/angular-animate/angular-animate.min.js'),
    path.join(nodeModulesDir, '/angular-filter/dist/angular-filter.min.js'),
    path.join(nodeModulesDir, '/angular-marked/dist/angular-marked.min.js'),
  ];
  return gulp.src(files)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('vendor.styles', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/css/font-awesome.min.css'),
    path.join(nodeModulesDir, '/os-bootstrap/dist/css/bootstrap.min.css'),
    path.join(nodeModulesDir, '/angular/angular-csp.css'),
    path.join(nodeModulesDir, '/babbage.ui/dist/lib.css'),
    path.join(nodeModulesDir, '/bubbletree/dist/bubbletree.css'),
    path.join(nodeModulesDir, '/c3/c3.min.css')
  ];
  return gulp.src(files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('vendor.fonts', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/fonts/*'),
    path.join(nodeModulesDir, '/os-bootstrap/dist/fonts/*')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(publicFontsDir));
});

gulp.task('app.assets', function() {
  return gulp.src([
      path.join(nodeModulesDir, '/os-bootstrap/dist/assets/os-branding/vector/light/os.svg'),
      path.join(nodeModulesDir, '/os-bootstrap/dist/assets/os-branding/vector/light/viewer.svg'),
      path.join(nodeModulesDir, '/os-bootstrap/dist/assets/os-branding/vector/light/osviewer.svg'),
  ])
    .pipe(gulp.dest(publicAssetsDir));
});

gulp.task('app.favicon', function() {
  var files = [
    path.join(nodeModulesDir, '/os-bootstrap/dist/assets/os-branding/viewer-favicon.ico')
  ];
  return gulp.src(files)
    .pipe(rename('favicon.ico'))
    .pipe(gulp.dest(publicDir));
});

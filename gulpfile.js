'use strict';

const _ = require('lodash');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const rimraf = require('rimraf');
const file = require('gulp-file');
const replace = require('gulp-replace');
const concat = require('gulp-concat');

const lib = require('./lib');
const webpackConfig = require('./webpack.config');

gulp.task('clean', (callback) => {
  rimraf('./dist', callback);
});

gulp.task('endpoint', ['clean'], () => {
  let endpoint = '/**\n * end point\n */\n';
  _.forEach(lib, (func, name) => {
    endpoint += `function ${name}() {}\n`;
  });
  return file('endpoint.js', endpoint, {src: true})
    .pipe(gulp.dest('./dist'));
});

gulp.task('webpack', ['endpoint'], (callback) => {
  gulp.src('lib/index.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist'))
    .on('end', callback);
});

gulp.task('build', ['webpack'], () => {
  gulp.src(['./dist/gsheet.js', './dist/endpoint.js'])
    .pipe(replace(/console.(log|warn|info|error)/g, 'Logger.log'))
    .pipe(replace(/alert/g, 'Browser.msgBox'))
    .pipe(concat('gsheet.gs'))
    .pipe(gulp.dest('./dist'));
});

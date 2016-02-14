'use strict';

const gulp = require('gulp');
// command line options
const args = require('yargs').argv;
// load all gulp modules in a 'plugin' object
const plugins = require('gulp-load-plugins')({lazy: true});
const _ = require('lodash');

gulp.task('default', ['help']);

// print available gulp tasks
gulp.task('help', plugins.taskListing);

// ensure tests are passing before allowing git commit
gulp.task('pre-commit', ['test']);

const allJs = [
  '*.js',
  'routes/**/*.js',
  'test/**/*.js',
  'services/**/*.js',
  'public/js/**/*.js'];

// analyze code for potential issues
gulp.task('vet', () => {
  log('Performing code analysis');
  return gulp
    // analyze all js files
    .src(allJs)
    // print processed files if verbose
    .pipe(plugins.if(args.verbose, plugins.print()))
    // analyze
    .pipe(plugins.jshint())
    // report
    .pipe(plugins.jshint.reporter('jshint-stylish', {verbose: true}))
    // fail task if code violations were found
    .pipe(plugins.jshint.reporter('fail'))
    .pipe(plugins.jscs());
});

// run mocha tests
gulp.task('test', ['vet'], () => {
  return gulp
    .src('./test/**/*.js')
    .pipe(plugins.mocha());
});

const viewsSrc = './views/*.jade';

// inject client-side dependencies in views
gulp.task('inject', ['test'], () => {
  const wiredep = require('wiredep').stream;
  const wiredepOpts = {
    ignorePath: '../public'
  };
  const injectSrc = gulp.src(
    ['./public/css/*.css', './public/js/*.js'], {read: false});
  const injectOpts = {
    ignorePath: '/public'
  };

  return gulp.src(viewsSrc)
    .pipe(wiredep(wiredepOpts))
    .pipe(plugins.inject(injectSrc, injectOpts))
    .pipe(gulp.dest('./views'));
});

const cssSrc = 'public/css/**/*.css';
const allSrc = _.concat(allJs, viewsSrc, cssSrc);

gulp.task('serve', ['test', 'inject'], () => {
  var options = {
    delayTime: 1,
    env: {
      'PORT': 5000
    },
    script: './bin/www',
    watch: [allSrc]
  };
  return plugins.nodemon(options)
    .on('restart', ['test'], evt => {
      log('nodemon restarted');
      log('files changed:\n' + evt);
    })
    .on('start', () => {
      log('nodemon started');
    })
    .on('crash', () => {
      log('nodemon crashed');
    })
    .on('exit', () => {
      log('nodemon exited');
    });
});

function log(msg) {
  plugins.util.log(msg);
}
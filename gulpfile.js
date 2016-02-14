'use strict';

const gulp = require('gulp');
// command line options
const args = require('yargs').argv;
// load all gulp modules in a 'plugin' object
const plugins = require('gulp-load-plugins')({lazy: true});

gulp.task('default', ['help']);

// print available gulp tasks
gulp.task('help', plugins.taskListing);

// ensure tests are passing before allowing git commit
gulp.task('pre-commit', ['test']);

// analyze code for potential issues
gulp.task('vet', function() {
  log('Performing code analysis');
  return gulp
    // analyze all js files
    .src(['*.js', './routes/*.js', 'test/**/*.js'])
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
gulp.task('test', ['vet'], function() {
  return gulp
    .src('./test/**/*.js')
    .pipe(plugins.mocha());
});

gulp.task('serve', ['test'], function() {
  var options = {
    script: './bin/www',
    watch: ['routes']
  };
  return plugins.nodemon(options)
    .on('restart', ['test'], function(evt) {
      log('nodemon restarted');
      log('files changed:\n' + evt);
    })
    .on('start', function() {
      log('nodemon started');
    })
    .on('crash', function() {
      log('nodemon crashed');
    })
    .on('exit', function() {
      log('nodemon exited');
    });
});

gulp.task('inject', ['test'], () => {
  const wiredep = require('wiredep').stream;
  
  return gulp.src('./views/*.jade')
    .pipe(wiredep())
    .pipe(gulp.dest('./views'));
});

function log(msg) {
  plugins.util.log(msg);
}
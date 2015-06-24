var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var mainBowerFiles = require('main-bower-files');
var del = require('del');

var paths = {
  app: './app/',
  build: './build/',
  components: './app/components/',
  less: './app/assets/less/',
  views: './app/views/',
};

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('build', function(cb) {
  runSequence(
    'clean',
    [
      'build-js',
      'build-less',
      'build-html',
    ],
  cb
  )
});

gulp.task('clean', function(cb) {
    del(paths.build, cb);
});

gulp.task('build-js', function(cb) {
  return gulp.src([
      paths.app + 'app.js',
      paths.app + '**/*-module.js',
      paths.app + '**/*-constant.js',
      paths.app + '**/*-provider.js',
      paths.app + '**/*-config.js',
      paths.app + '**/*-value.js',
      paths.app + '**/*-factory.js',
      paths.app + '**/*-directive.js',
      paths.app + '**/*-controller.js',
      paths.app + '**/*.js'
  ])
    .pipe($.concat('app.min.js'))
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest(paths.build));
});

gulp.task('build-html', function(cb) {
    return gulp.src([
        paths.app + '**/*.html'
    ])
      .pipe(gulp.dest(paths.build))
  
});

gulp.task('build-less', function(cb) {
  return gulp.src([
    paths.less + 'app.less'
  ])
    .pipe($.plumber(handleError))
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe($.minifyCss({keepSpecialComments: 0}))
    .pipe(gulp.dest(paths.build));
});

gulp.task('watch', function(cb) {
    runSequence(
      [
        'watch-less',
        'watch-js',
        'watch-html',
      ],
      cb
    )
});

gulp.task('watch-less', function(cb) {
  return gulp.watch(paths.app + '**/*.less', ['build-less']);
});

gulp.task('watch-js', function(cb) {
  return gulp.watch(paths.app + '**/*.js', ['build-js']);
});

gulp.task('watch-html', function(cb) {
  return gulp.watch(paths.app + '**/*.html', ['build-html']);
});

gulp.task('heroku:production', function(cb) {
  cb();
});

gulp.task('default', function(cb) {
  runSequence(
    [
      'build',
      'watch'
    ],
    cb
  )
});

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var paths = {
    app: './app/',
    components: './app/components/',
    less: './app/less/',
    views: './app/views/',
};

gulp.task('build-less', function(cb) {
    return gulp.src([
        paths.less + 'app.less'
    ])
        .pipe($.less())
        .pipe(gulp.dest(paths.app))
});

gulp.task('watch', function(cb) {
    return gulp.watch([
        paths.less + '**/*.less',
        paths.components + '**/*.less',
        paths.views + '**/*.less',
    ], ['build-less']);
});

gulp.task('heroku:production', function(cb) {
    cb();
});

gulp.task('default', function(cb) {
    runSequence(
        [
            'build-less',
            'watch'
        ],
        cb
    )
});

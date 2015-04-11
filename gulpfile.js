var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    indexHtml: './index.html',
};

gulp.task('serve', function(cb) {
    gulp.src('.')
        .pipe($.webserver({
            livereload: true,
            open: false,
            fallback: paths.indexHtml
        }));
});

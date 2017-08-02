var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

gulp.task('sass', function () {
    return gulp.src('app/scss/organizer.scss')
        .pipe( sass() )
        .pipe( gulp.dest('app/css') )
        .pipe( connect.reload() );
});

gulp.task('html', function () {
    return gulp.src('app/index.html')
        .pipe( connect.reload() );
});

gulp.task('js', function () {
    return gulp.src('app/js/*.js')
        .pipe( connect.reload() );
});
 
gulp.task('webserver', function() {
    connect.server({ 
        name: 'Dev App',
        root: 'app',
        port: 8080,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/js/*.js', ['js']);
});
 
gulp.task('default', [
    'sass', 
    'html', 
    'js',
    'webserver', 
    'watch'
]);
var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

gulp.task('sass', function () {
    return gulp.src('app/scss/organizer.scss')
        .pipe( sass() )
        .pipe( gulp.dest('app/css') )
        .pipe( connect.reload() );
});
 
gulp.task('webserver', function() {
  connect.server({
    //livereload: true
  });
});

gulp.task('watch', function () {
    gulp.watch('app/scss/*.scss', ['sass']);
});
 
gulp.task('default', ['sass', 'webserver', 'watch']);
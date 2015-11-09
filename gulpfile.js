var gulp = require('gulp'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    imageop = require('gulp-image-optimization'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del');

// clean task to clean build folder before building an entire app
gulp.task('clean', function (cb) {
    del('build/**/*', cb);
});

// minify scripts
gulp.task('scripts', function () {
    gulp.src('dev/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'))
        .pipe(reload({ stream:true }));
});

// minify styles
gulp.task('styles', function () {
    gulp.src('dev/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('build'))
        .pipe(reload({ stream:true }));
});

// minify html
gulp.task('html', function() {
  var opts = {
    empty: true,
    spare: true
  };

  return gulp.src('dev/**/*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('build'));
});

// optimize images
gulp.task('images', function(cb) {
    gulp.src(['dev/**/*.png','dev/**/*.jpg','dev/**/*.gif','dev/**/*.jpeg'])
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('build'));
});

// watch task
gulp.task('serve', function () {
    browserSync({
        port: 8000,
        server: {
            baseDir: 'build'
        }
    });

    gulp.watch('dev/**/*.css', ['styles']);
    gulp.watch('dev/**/*.html', ['html-critical']);
    gulp.watch('dev/**/*.js', ['scripts']);
});

// default build task to clean build directory, then create the correct folder
// structure with minified files, optimized images and inline critical css.
gulp.task('default', ['clean'], function () {
    gulp.start('scripts', 'styles', 'html', 'images');
});

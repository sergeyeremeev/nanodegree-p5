var gulp = require('gulp'),
    del = require('del'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    imageop = require('gulp-image-optimization');

// clean task to clean build folder before building an entire app
gulp.task('clean', function (cb) {
    del('build/**/*', cb);
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

// minify scripts
gulp.task('scripts', function () {
    gulp.src('dev/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

// compile sass to css
gulp.task('styles', function () {
    var sassOptions = {
        errLogToConsole: true,
        outputStyle: 'expanded'
    };
    
    var autoprefixerOptions = {
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    };
    
    gulp.src('dev/sass/**/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass(sassOptions).on('error', sass.logError))
            .pipe(concat('style.css'))
            .pipe(autoprefixer(autoprefixerOptions))
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest('dev/css/'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css/'));
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
gulp.task('watch', function () {
    gulp.watch('dev/sass/**/*.scss', ['styles']);
    gulp.watch('dev/**/*.html', ['html']);
    gulp.watch('dev/**/*.js', ['scripts']);
});

// default build task to clean build directory, then create the correct folder
// structure with minified files, optimized images and inline critical css.
gulp.task('default', ['clean'], function () {
    gulp.start('scripts', 'styles   ', 'html', 'images');
});

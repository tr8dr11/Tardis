var gulp = require('gulp');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var image = require('gulp-image');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

gulp.task('clean', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./dist/"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function() {
  gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('fonts', function() {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('static', function() {
  gulp.src('src/static/**/*')
    .pipe(gulp.dest('dist/static/'));
});

gulp.task('styles-vendor', function() {
  gulp.src('src/styles/vendor/**/*.css')
    .pipe(concat('vendor.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('styles', function() {
  gulp.src([
    'src/styles/**/fonts.scss',
    'src/styles/**/common.scss',
    'src/styles/**/*.scss',
    '!src/styles/vendor/**/*.css',
  ])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('styles.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts-vendor', function() {
  return gulp.src(['src/scripts/vendor/**/*.js'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function() {
  return gulp.src([
    'src/scripts/**/*.js',
    '!src/scripts/vendor/**/*.js',
  ])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('templates', function() {
  gulp.src('src/templates/**/*.html')
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('build', [
  'styles-vendor',
  'styles',
  'scripts-vendor',
  'scripts',
  'templates',
  'images',
  'fonts',
  'static',
  'browser-sync',
], function(){
  gulp.watch("src/styles/vendor/**/*.scss", ['styles-vendor']);
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/vendor/**/*.js", ['scripts-vendor']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("src/templates/**/*.*", ['templates']);
  gulp.watch("src/images/**/*.*", ['images']);
  gulp.watch("src/fonts/**/*.*", ['fonts']);
  gulp.watch("src/static/**/*.*", ['static']);
  gulp.watch("*.html", ['bs-reload']);
});

gulp.task('default', function() {
  runSequence(['clean'], ['build']);
});

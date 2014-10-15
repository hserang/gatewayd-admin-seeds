var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var merge = require('merge-stream');

var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

//server
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

var paths = {
    sass: './app/styles/**/*.scss',
    html: './app/*.html',
    main_js: ['./app/scripts/main.jsx'],
    js: ['app/scripts/**/*.js'],
    jsx: ['app/scripts/**/*.jsx'],
    fonts: './app/libs/bootstrap-sass-official/assets/fonts/**/*.{ttf,woff,eot,svg}',
    build: {
      fonts: './dist/fonts/',
      styles: './dist/styles/',
      html: './dist/',
      scripts: './dist/scripts/'
    }
};

//tasks
gulp.task('clean', function(cb) {
  del(['build'], cb);
});


gulp.task('copy', ['clean'], function() {
  var fonts, index;

  fonts = gulp.src(paths.fonts)
          .pipe(gulp.dest(paths.build.fonts));

  index = gulp.src(paths.html)
          .pipe(gulp.dest(paths.build.html));

  return merge(fonts, index);
});

gulp.task('sass', ['clean'], function() {
  gulp
    .src([paths.sass])
    .pipe(sass({errLogToConsole: true}))
    .pipe(gulp.dest(paths.build.styles));
});

gulp.task('js', ['clean'], function() {

  // Browserify/bundle the JS.
  browserify(paths.main_js)
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.build.scripts));
});

gulp.task('connect', function() {
  connect.server({
    root: './dist/'
  });
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['copy']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.jsx, ['js']);
  gulp.watch('./dist/**/*.{html,css,js}').on('change', function() {
    console.log("watch", arguments);
    livereload.changed();
  });
});

// The default task (called when you run `gulp` from cli)
gulp.task('dev', ['copy','connect', 'watch', 'sass', 'js']);


/* ==========================================================================
   GETTING STARTED - If you're using this on a new project
   ========================================================================== */
/**
 * #1 run: 'npm install -g gulp' (If gulp isn't already installed on your system)
 *
 * #2 run: 'npm init' To configure a new package.json (If one didn't come with the provided project files)
 *
 * #3 run: 'npm install --save-dev gulp'
 *
 * #4 Create your 'src' folder and working folders/files.
 *
 * #5 Create your 'gulpfile.js' in the root directory
 *
 * The rest is all setup for you. So you're ready to go!
 * For more complex configs or if you want to use React,
 * try our webpack starter kit - https://github.com/squaredindex/webpack-starter-kit
 */



// Require Gulp - Don't remove
const gulp                  = require('gulp');
      imagemin              = require('gulp-imagemin');
      tiny                  = require('gulp-tinypng-nokey');
      concat                = require('gulp-concat');
      uglify                = require('gulp-uglify');
      sass                  = require('gulp-sass');
      sourcemaps            = require('gulp-sourcemaps');
      useref                = require('gulp-useref');
      gulpif                = require('gulp-if');
      concatCss             = require('gulp-concat-css');
      autoprefixer          = require('gulp-autoprefixer');
      cmq                   = require('crlab-gulp-combine-media-queries');
      babel                 = require('gulp-babel');
      uncss                 = require('gulp-uncss');
      cleanCSS              = require('gulp-clean-css');
      cssshrink             = require('gulp-cssshrink');
      htmlmin               = require('gulp-htmlmin');
      browserSync           = require('browser-sync').create();


/* ==========================================================================
   TOP LEVEL FUNCTIONS
   ========================================================================== */
/**
 * gulp.task    = Define tasks
 * gulp.src     = Points to the files to use
 * gulp.dest    = Points to the folder to output
 * gulp.watch   = Watch files and folders for changes
 */

// Copy all HTML files to dist

gulp.task('copyhtml', function(){
    gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream: true}));
});


// Minify Images

gulp.task('minimg', function() {
gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img')),

// TinyPNG (NoKey)
gulp.src('src/img/**/*{png,apng,jpg,jpeg}')
    .pipe(tiny())
    .pipe(gulp.dest('dist/img'));
});


// Minify JavaScript

gulp.task('minjs', function(){
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
});


// Compile SASS/SCSS

gulp.task('sass', function(){
    gulp.src('src/styles/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('../../../dist/css/maps'))
        .pipe(gulp.dest('src/styles/css'))
        .pipe(browserSync.reload({stream: true}));
});


// Concatinate CSS

gulp.task('css', function(){
    gulp.src('src/styles/css/*.css')
        .pipe(concatCss('app.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({stream: true}));
});


// Remove unused CSS & Minify

gulp.task('cssprod', function(){
    gulp.src('dist/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 version'],
            cascade: false
        }))
        .pipe(cmq())
        .pipe(uncss({
            html: ['src/**/*.html'],
            // Add JS classes/IDs to ignore list
            ignore: [
                ''
            ]
        }))
        .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
        .pipe(cssshrink())
        .pipe(gulp.dest('dist/css'));
});


// Minify HTML

gulp.task('htmlprod', function() {
    gulp.src('src/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist'));
  });

// Concatinate & Minify Scripts

gulp.task('scripts', function(){
    gulp.src('src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('browserSync', function() {
    browserSync.init({
        injectChanges: true,
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('watch', ['browserSync', 'sass', 'css'], function(){
    gulp.watch('src/styles/sass/**/*.scss', ['sass']);
    gulp.watch('src/styles/css/**/*.css', ['css']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/**/*.html', ['copyhtml']);
    gulp.watch('src/img/*.', ['minimg']);
});


gulp.task('default', ['copyhtml', 'scripts', 'sass', 'css', 'minimg']);

gulp.task('prod', ['htmlprod', 'scripts', 'sass', 'css', 'cssprod', 'minimg']);

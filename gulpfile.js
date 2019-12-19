const fs              = require('fs');
const config          = JSON.parse(fs.readFileSync(process.env['HOME']+'/.aws/fed-credentials'));
const projectFile     = './project.json';
const projectData     = require(projectFile);
const gulp            = require('gulp');
const autoprefixer    = require('gulp-autoprefixer');
const cleanCSS        = require('gulp-clean-css');
const imagemin        = require('gulp-imagemin');
const include         = require('gulp-include');
const notify          = require('gulp-notify');
const plumber         = require('gulp-plumber');
const rename          = require('gulp-rename');
const s3              = require('gulp-s3-upload')(config);
const sass            = require('gulp-sass');
const sourcemaps      = require('gulp-sourcemaps');
const uglify          = require('gulp-uglify');
const fancyLog        = require('fancy-log');
const colors          = require('ansi-colors');
const pngquant        = require('imagemin-pngquant');
const runSequence     = require('run-sequence') ;
const eslint          = require('gulp-eslint');
const sassLint        = require('gulp-sass-lint');
const babel           = require('gulp-babel');


// Project Architecture
const siteNumber = projectData.siteNumber;
const s3Bucket = 'assets.ngin.com/site_files/' + siteNumber;
const sassSource = '_source/sass/**/*.scss';
const cssDest = '_site/css'
const javascriptManifests = '_source/js/[!_]*.js';
const javascriptSource = '_source/js/**/*.js';
const javascriptDest = '_site/js'
const imageSource = '_source/images/**/*';
const imageDest = '_site/images';

const s3bucketObject = (dest, cacheInSeconds, acl = 'public-read') => {
  let s3Object = {};
  if (dest === s3Bucket) s3Object.Bucket = s3Bucket;
  if (dest !== s3Bucket) s3Object.Bucket = s3Bucket+'/'+dest;
  if (cacheInSeconds) s3Object.CacheControl = 'max-age='+cacheInSeconds;
  s3Object.ACL = acl;
  return s3Object;
};
const logMinifyDetails = (details) => {
  let percentage = ((details.stats.efficiency * 100).toFixed(2))+"%";
  let newSize = (details.stats.minifiedSize / 1000)+"kbs";
  fancyLog(colors.green(details.name) + " " + colors.magenta(newSize) + " "+ colors.gray(percentage));
};
const onError = (err) => {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Beep"
  })(err);
};
// Compiling Tasks

gulp.task('sasslint', () => {
  return gulp
    .src(sassSource)
    .pipe(sassLint())
    // .pipe(gulp.dest('_source/sass/'))
    .pipe(sassLint.format())
    // .pipe(eslint.failAfterError());
});

gulp.task('compile-sass', () => {
  return gulp
    .src(sassSource)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'expanded'}))
    .pipe(autoprefixer({
      browsers: ['Last 3 versions', 'not IE < 11'],
      grid: 'autoplace'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cssDest))
    .pipe(cleanCSS(
      {debug: true},
      (details) => { logMinifyDetails(details) }
    ))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(cssDest));
});

gulp.task('eslint', () => {
  return gulp
    .src('_source/js/**/_*.js')
    .pipe(eslint({fix: true}))
    .pipe(gulp.dest('_source/js/'))
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError());
});

gulp.task('compile-js', () => {
  return gulp
  .src(javascriptManifests)
  .pipe(plumber({errorHandler: onError}))
  .pipe(include({extensions: "js"}))
  .pipe(babel({
    presets: ['@babel/env'],
    sourceType: 'script',
    comments: true,
    retainLines: true,
  }))
  .pipe(gulp.dest(javascriptDest))
  .pipe(uglify({mangle: false}))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest(javascriptDest));
});

gulp.task('process-images', () => {
  return gulp
  .src(imageSource)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()]
  }))
  .pipe(gulp.dest(imageDest));
});

// s3 Upload Tasks

gulp.task('upload-css', () => {
  return gulp
    .src(cssDest + '/**/*.css')
    .pipe(s3(s3bucketObject(cssDest, '0')));
});

gulp.task('upload-js', () => {
  return gulp
    .src(javascriptDest + '/**/*.js')
    .pipe(s3(s3bucketObject(javascriptDest, '0')));
});

gulp.task('upload-images', () => {
  return gulp
    .src(imageDest + '/**/*')
    .pipe(s3(s3bucketObject(imageDest)));
});

gulp.task('upload-site', () => {
  return gulp
    .src('_site/**/*')
    .pipe(s3(s3bucketObject('_site')));
});



// Orchestration Tasks
gulp.task('process-css', (cb) => { runSequence('compile-sass', cb) });
gulp.task('process-js', (cb) => { runSequence('compile-js', cb) });
gulp.task('css', (cb) => { runSequence('compile-sass', 'upload-css', cb) });
gulp.task('js', (cb) => { runSequence('process-js', 'upload-js', cb) });
gulp.task('img', (cb) => { runSequence('process-images', 'upload-images', cb) });

gulp.task('compile', ['process-css', 'process-js', 'process-images']);
gulp.task('deploy', ['upload-site']);
gulp.task('compile-deploy', (cb) => { runSequence('compile', 'deploy', cb) });

// Watch tasks
gulp.task('dev-live', () => {
  gulp.watch(sassSource, ['css']);
  gulp.watch(javascriptSource, ['js']);
  gulp.watch(imageSource, ['img']);
});

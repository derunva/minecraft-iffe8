var gulp = require('gulp')
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var cleancss = require('gulp-cleancss');
var autoprefixer = require('gulp-autoprefixer');
var server = require('gulp-server-livereload');
var debug = require('gulp-debug');
var plumberNotifier = require('gulp-plumber-notifier');
const cached = require('gulp-cached');
const sassPartialsImported = require('gulp-sass-partials-imported');
var pugInheritance = require('gulp-pug-inheritance');
gulp.task('webserver', function() {
  gulp.src('./dist')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: false,
      host: '0.0.0.0'
    }));
});

gulp.task('imgCopy',async function(){
  gulp.src('./app/img/*')
    .pipe(cached('images'))
    .pipe( gulp.dest('./dist/img/') )
})
gulp.task('jsBuild',async function(){
  gulp.src('./app/js/*.js')
    .pipe(debug())
    .pipe(cached('js'))
    .pipe(debug())
    .pipe( gulp.dest('./dist/js/') )
})
gulp.task('htmlBuild',async function(){
  gulp.src('./app/*.pug')
    .pipe(plumberNotifier())
    .pipe( pug({
      pretty: true
    }) )
    .pipe( gulp.dest('./dist/') )
})

gulp.task('cssBuild', async function(){
  gulp.src('./app/scss/*.sass')
  .pipe(plumberNotifier())
  .pipe(cached('sass'))
  .pipe(sassPartialsImported('./app/scss/', './app/scss/'))
  .pipe( sass() )
  .pipe(cleancss({keepBreaks: true}))
  .pipe(autoprefixer({
      browsers: ['last 20 versions'],
      cascade: false
  }))
  .pipe( gulp.dest('./dist/css/'))
})

gulp.task('watcher',async function(){
  gulp.watch('./app/img/*', gulp.series('imgCopy'))
  gulp.watch('./app/scss/*.sass', gulp.series('cssBuild'))
  gulp.watch('./app/js/*.js', gulp.series('jsBuild'))
  gulp.watch(['./app/*.pug','./app/partials/*.pug'], gulp.series('htmlBuild'))
})
gulp.task('serve', gulp.parallel('watcher', 'webserver'))
gulp.task('default', async function(){
  console.log('Привіт')
})

// Dependencies
var gulp         = require('gulp');
var concat       = require('gulp-concat');
var streamqueue  = require('streamqueue');
var gutil        = require('gulp-util');
var uglify       = require('gulp-uglifyjs');
var compass      = require('gulp-compass');
var plumber      = require('gulp-plumber');
var notify       = require("gulp-notify");
var purify       = require('purify-css');
var svgSprite    = require("gulp-svg-sprites");
var webserver    = require('gulp-webserver');
var injectPartials = require('gulp-inject-partials');
//var babelify = require('babelify');
 
gulp.task('webserver', function() {
  gulp.src('dev')
    .pipe(webserver({
      port : 8080,
      livereload: true,
      directoryListing: false,
      open: true,
      // path : '/dev'
    }));
});

// Partial renderer 

gulp.task('ptl_render', function () {
  return gulp.src('./dev/templates/*.html')
           .pipe(plumber(function (error) {
                gutil.log(error.message);
                this.emit('end');
            }))
           .pipe(injectPartials({
              removeTags: true
           }))
           .pipe(gulp.dest('./dev'));
});


// Compass compiler
gulp.task('compass', function() {
  gulp.src('./dev/sass/**/*.scss')
    .pipe(plumber(function (error) {
                gutil.log(error.message);
                this.emit('end');
            }))
    .pipe(compass({
      config_file: 'config.rb',
      css: './dev/assets/css',
      sass:'./dev/sass'
    }))
    .pipe(gulp.dest('./dev/assets/css'));
});

// Purify css
gulp.task('css-purify',function(){
 var content = ['./dev/*.html','./dev/assets/js/*.js'];
 var css = ['./dev/assets/css/styles.css'];
 var excludeClasses = [];
 var options = {
  // Will write purified CSS to this file.
  minify    : true,
  output    : './dev/assets/css/styles.min.css',
  whitelist : excludeClasses
  };
  purify(content, css, options);

});


// Gulp scripts

gulp.task('scripts', function() {
   return streamqueue({ objectMode: true },
       //gulp.src('dev/lib/modernizr.custom.min.js'), 
       //gulp.src('dev/lib/jquery-2.1.1.min.js'),
       //gulp.src('dev/lib/greensock/utils/Draggable.js'), 
       //gulp.src('dev/lib/greensock/utils/SplitText.js'), 
       //gulp.src('dev/lib/greensock/TweenMax.js'),
       //gulp.src('dev/lib/greensock/plugins/DrawSVGPlugin.js'),   
       //gulp.src('dev/lib/greensock/plugins/MorphSVGPlugin.js'),
       //gulp.src('dev/lib/greensock/plugins/ScrollToPlugin.js'),
       //gulp.src('dev/lib/scrollmagic/ScrollMagic.js'),
       //gulp.src('dev/lib/scrollmagic/plugins/animation.gsap.js'),
       //gulp.src('dev/lib/slick.js'),
       //gulp.src('dev/lib/select2.js'),  
       //gulp.src('dev/lib/moment.js'),
       //gulp.src('dev/lib/bootstrap.js'),  
       //gulp.src('dev/lib/bootstrap-datepicker.js'),
       //gulp.src('dev/lib/select2.min.js'),
       //gulp.src('dev/lib/app/components/components.js'),
       //gulp.src('dev/lib/app/app.js'),
       //gulp.src('dev/lib/calendar.js'),
       gulp.src('dev/lib/scripts.js')
   )
   .pipe(concat('bundle.js'))
   .pipe(uglify('main.min.js'))
   .pipe(gulp.dest('dev/assets/js/'));
});


// Live watch
gulp.task('watch', function(){
    gulp.watch('./dev/templates/**/*.html', ['ptl_render']);
    gulp.watch('./dev/sass/**/*.scss', ['compass']);
    gulp.watch('./dev/lib/**/*.js', ['scripts']);
    //gulp.watch('./dev/assets/css/styles.css', ['css-purify']);
});


// Set defaults
gulp.task('default', ['webserver','ptl_render','scripts','compass','watch']);


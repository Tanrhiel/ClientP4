const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const scss = require('gulp-sass');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const minify = require('gulp-minify');
const del = require('del');
const fileinclude = require('gulp-file-include');

const srcPath = 'src';
const destPath = 'dist';
const scssPath = srcPath + '/scss';
const jsPath = srcPath + '/js';
const htmlPath = srcPath;
const assetsPath = srcPath;
const cssPath = destPath + '/css';
const assetsOutputPath = destPath;
const jsOuputPath = destPath + '/js';
const htmlOutputPath = destPath;
const vendorPath = destPath + '/vendor';
const nodePath = 'node_modules';

gulp.task('compile:css', function() {
    const scssFiles = [scssPath + '/**/*.scss']
    return gulp.src(scssFiles)
        .pipe(scss().on('error', scss.logError))
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(cssPath))
        .pipe(browserSync.reload({
            stream: true
          }))
})

// Récupère tous les fichiers listés pour les placer dans le www
gulp.task('fix:assets', function() {
var assets = [
    assetsPath + '/**/*.{eot,svg,ttf,woff,woff2,png,jpg,gif,ico,mp4,ogg,webm,json}'
];
return gulp.src(assets)
    .pipe(gulp.dest(assetsOutputPath))
    .pipe(browserSync.reload({
        stream: true
    }))
})

gulp.task('compile:js', function() {
    const jsFiles = [jsPath + '/**/*.js']
    return gulp.src(jsFiles)
        // .pipe(minify({
        //     ext: { min: '.min.js' },
        //     noSource: true,
        //     ignoreFiles: ['.combo.js', '-min.js', '.min.js']
        // }))
        .pipe(gulp.dest(jsOuputPath))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('compile:html', function() {
    var html = [
        htmlPath + '/**/*.html',
        '!' + htmlPath + 'views/**/*.html',
        '!' + htmlPath + '/**/\_*.html'
    ];
    return gulp.src(html)
        .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
        }))
        .pipe(gulp.dest(htmlOutputPath))
        .pipe(browserSync.reload({
            stream: true
        }));
});  

gulp.task('clean:vendor', function() {
    return del(vendorPath);
});

gulp.task('vendor:assets', gulp.series('clean:vendor', function(callback) {
    // JQuery
    // gulp.src([nodePath + '/jquery/dist/jquery.min.js'])
    //   .pipe(gulp.dest(vendorPath + '/jquery'));
    // gulp.src([nodePath + '/jquery/dist/jquery.min.map'])
    //   .pipe(gulp.dest(vendorPath + '/jquery'));

    // // bootstrap
    // gulp.src([nodePath + '/bootstrap/dist/js/bootstrap.min.js'])
    //   .pipe(gulp.dest(vendorPath + '/bootstrap'));
    // gulp.src([nodePath + '/bootstrap/dist/js/bootstrap.min.js.map'])
    //   .pipe(gulp.dest(vendorPath + '/bootstrap'));
  
    // Font Awesome
    gulp.src([nodePath + '/@fortawesome/fontawesome-free/css/all.min.css'])
      .pipe(gulp.dest(vendorPath + '/fontawesome/css'));
    gulp.src([nodePath + '/@fortawesome/fontawesome-free/webfonts/*'])
      .pipe(gulp.dest(vendorPath + '/fontawesome/webfonts'));
    gulp.src([nodePath + '/@fortawesome/fontawesome-free/sprites/*'])
      .pipe(gulp.dest(vendorPath + '/fontawesome/sprites'));
    gulp.src([nodePath + '/@fortawesome/fontawesome-free/svgs/**/*'])
      .pipe(gulp.dest(vendorPath + '/fontawesome/svgs'));
    gulp.src([nodePath + '/@fortawesome/fontawesome-free/js/all.min.js'])
      .pipe(gulp.dest(vendorPath + '/fontawesome/js'));
  
    return callback();
  }));

gulp.task('clean', function() {
    return del(destPath);
});

gulp.task('build',
  gulp.series('clean',
  gulp.parallel('compile:css', 'compile:js'),
  gulp.parallel('fix:assets', 'vendor:assets'),
  gulp.parallel('compile:html')));

gulp.task('default', gulp.series('build'));

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./" + destPath + "/"
        },
    });
    gulp.watch(assetsPath + '/**/*.{eot,svg,ttf,woff,woff2,png,jpg,gif,ico,mp4,ogg,webm,json}', gulp.series('fix:assets'));
    gulp.watch(scssPath + '/**/*.scss', gulp.series('compile:css'));
    gulp.watch(jsPath + '/**/*.js', gulp.series('compile:js'));
    gulp.watch(htmlPath + '/**/*.html', gulp.series('compile:html'));
})


gulp.task('watch', gulp.series('default', 'browser-sync', function() {}));
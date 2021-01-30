const
    gulp = require('gulp'),
    notify = require('gulp-notify'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    cmq = require('gulp-group-css-media-queries'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload  = browserSync.reload,
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    pugPHPFilter = require('pug-php-filter'),
    flatten = require('gulp-flatten'),
    clean_CSS = require('gulp-clean-css'),
    minifyjs = require('gulp-uglify-es').default;
/* --==[ Пути ]==--*/
const
    projectName = "G-Engine",
    projectPath = '../workspace';

const
    html =  {
        pretty: true,
        err_title: "Ошибка компиляции в HTML",
        src_build : ['templates/*.pug'],
        src_all : [
            'templates/template/*.pug',
            'templates/parts/*.pug',
            'templates/*.pug'
        ],
        dest: projectPath
    },
    css = {
        err_title: "Ошибка при компиляции в CSS",
        src_build : ['sass/*.sass'],
        src_libs : ['sass/css_js/*.css'],
        file_name: 'main.css',
        src_all : [
            'sass/**/*.sass',
            'sass/media/*.sass',
            'sass/grid/*.sass',
            'sass/ui/*.sass'
        ],
        dest: projectPath+'/css'
    },
    js = {
        src_build : ['front/*.js'],
        file_name: 'boot.js',
        src_all : [
           'front/**/*.js',
        ],
        dest: projectPath+'/front'
    },
    php = {
        src_build : ['front/*.php', 'templates/**/*.php'],
        file_name: 'boot.js',
        src_all : [
            'front/**/*.php',
            'templates/**/*.php',
        ],
        dest: projectPath+'/front'
    },
    img = {
        src_all : ['img/**/*'],
        dest: projectPath+'/img'
    };
gulp.task('php', function(){
  return gulp.src(php['src_all'])
      .pipe(
          gulp.dest(php['dest'])
      )
      .pipe(reload({stream:true}));
});
gulp.task('html', function(){
    return gulp.src(html['src_build'])
        .pipe(
            pug({
                pretty: html['pretty'],
                basedir: 'I:/gulp/',
                filters: {
                    php: pugPHPFilter
                }
            })
                .on('error',
                    notify.onError({
                        message: "<%= error.message%>",
                        title : html['err_title']
                    })
                )
        )
        .pipe(
            rename(function (path) {
                path.extname = ".php"
            })
        )
        .pipe(
            gulp.dest(html['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('html_func', function(){
    return gulp.src(html['src_all'])
        .pipe(
            pug({
                basedir: 'I:/gulp/',
                pretty: html['pretty']
            }).on('error',
                notify.onError({
                    message: "<%= error.message%>",
                    title : html['err_title']
                })
            )
        ).pipe(reload({stream:true}));
});
gulp.task('css', function(){
    return gulp.src(css['src_build'])
        .pipe(
            sass({
                outputStyle: css['style']
            })
                .on( 'error', notify.onError({
                    message: "<%= error %>",
                    title : css['err_title']
                }))
        )
        .pipe(
            concat(css['file_name'])
        )
        .pipe(
            gulp.dest(css['dest'])
        ).pipe(reload({stream:true}));
});
gulp.task('js',function() {
  return gulp.src(js['src_all'])
      .pipe(
          gulp.dest(js['dest'])
      )
      .pipe(reload({stream:true}));
});
gulp.task('media_query',function () {
    return gulp.src(projectPath+'/css/*.css')
        .pipe(cmq({
            log: true
        }))
        .pipe(gulp.dest(projectPath+'/css'));
});

gulp.task('move_images', function() {
  return gulp.src(img['src_all'])
      .pipe(
          flatten({ includeParents: 10 })
      )
      .pipe(
          gulp.dest(img['dest'])
      )
});
gulp.task('move_fonts', function() {
  return gulp.src('sass/fonts/*.*')
      .pipe(
          flatten({ includeParents: 10 })
      )
      .pipe(
          gulp.dest(projectPath+'/css/fonts')
      )
});

gulp.task('browserSync', function() {
    browserSync.init({
      proxy: 'gengine',
      open: true,
      notify: true
    });
});

gulp.task('min_main', function() {
    return gulp.src(img['src_all'])
        .pipe(imagemin())
        .pipe(
            gulp.dest(img['dest'])
        )
});
gulp.task('min_css',function () {
  return gulp.src(projectPath+'/css/*.css')
      .pipe(cmq({
        log: true
      }))
      .pipe(clean_CSS())
      .pipe(gulp.dest(projectPath+'/css'));
});
gulp.task('min_js',function() {
  return gulp.src(js['src_all'])
      .pipe(minifyjs())
      .pipe(
          gulp.dest(js['dest'])
      );
});

gulp.task('watch', function() {
    gulp.watch(html['src_all'],{usePolling:true},gulp.series('html'));
    gulp.watch(php['src_all'],{usePolling:true},gulp.series('php'));
    gulp.watch(css['src_build'],{usePolling:true},gulp.parallel('css'));
    gulp.watch(css['src_all'],{usePolling:true},gulp.parallel('css'));
    gulp.watch(js['src_all'],{usePolling:true},gulp.parallel('js'));
    gulp.watch(img['src_all'],{usePolling:true},gulp.parallel('move_images'));
  });

gulp.task('minify',gulp.parallel('min_main','min_css','min_js','media_query'));

gulp.task('default', gulp.parallel('watch','html','js','php','move_fonts','css','browserSync','move_images','media_query'));



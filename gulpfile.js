var gulp = require('gulp');

// Pug
var pug = require('gulp-pug');
var fs = require('fs');
var data = require('gulp-data');
var path = require('path');

// CSS
var sass = require('gulp-sass')
var sassGlob = require('gulp-sass-glob');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');

// JS
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Image
var imagemin = require('gulp-imagemin');

// Iconfont
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

// Styleguide
var aigis = require('gulp-aigis');

// Utility
var cache = require('gulp-cached');
var changed  = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var ssi = require("browsersync-ssi");
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var rimraf = require('rimraf');

/**
 * 開発用ディレクトリ
 */
var src = {
  'root': 'src/',
  'html': ['src/**/*.pug', '!src/**/_*.pug'],
  'data': 'src/_data/',
  'css': 'src/**/*.scss',
  'styleguideWatch': ['src/**/*.scss', 'src/**/*.md'],
  'libJs': 'src/assets/js/lib/**/*.js',
  'siteJs': 'src/assets/js/namespace/**/*.js',
  'jsWatch': 'src/**/*.js',
  'image': 'src/assets/img/**/*.{png,jpg,gif,svg}',
  'imageWatch': 'src/assets/img/**/*',
  'iconfont': 'src/assets/icon/**/*.svg',
  'iconfontWath': ['src/assets/icon/**/*.svg', 'src/assets/icon/template/_Icon.scss'],
  'public': 'public/**/*'
};

/**
 * テスト用ディレクトリ
 */
var dest = {
  'root': 'htdocs/',
  'image': 'htdocs/assets/img/',
  'js': 'htdocs/assets/js/',
  'iconfont': 'htdocs/assets/font/'
};

/**
 * `.pug`を`.html`にコンパイルします。
 * JSONとページごとのルート相対パスの格納、ルート相対パスを使ったincludeの設定をします。
 */
gulp.task('html', function() {
  // JSONファイルの読み込み。
  var locals = {
    'site': JSON.parse(fs.readFileSync(src.data + 'site.json'))
  };
  locals.ja = {
    // 日本語サイト共通のデータです。
    'site': JSON.parse(fs.readFileSync(src.data + 'ja/site.json'))
  };
  locals.en = {
    // 英語サイト共通のデータです。
    'site': JSON.parse(fs.readFileSync(src.data + 'en/site.json'))
  };
  return gulp.src(src.html)
  // エラーでタスクを止めない
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(data(function(file) {
    // 各ページのルート相対パスを格納します。
    locals.pageAbsolutePath = '/' + path.relative(file.base, file.path.replace(/.pug$/, '.html')).replace(/index\.html$/, '');
      return locals;
  }))
  .pipe(cache('html'))
  .pipe(pug({
    // `locals`に渡したデータを各Pugファイルで取得できます。
    locals: locals,
    // ルート相対パスでincludeが使えるようにします。
    basedir: 'src',
    // Pugファイルの整形。
    pretty: true
  }))
  .pipe(gulp.dest(dest.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * `.scss`を`.css`にコンパイルします。
 */
gulp.task('css', function(){
  var plugins = [
    autoprefixer({
      // ベンダープレフィックスの付与
      // https://github.com/ai/browserslist#browsers
      // 条件によって対応できるブラウザを確認できる（カンマ区切りで指定を記述する）
      //  http://browserl.ist/
      browsers: [
        // すべてのブラウザの最新1バージョン
        'last 1 version',
        // 日本で3%以上のシェアがあるバージョン
        '> 3% in JP',
        // IE9以上
        'ie >= 9',
        // iOS8以上
        'iOS >= 8',
        // Android4.4以上
        'Android >= 4.4'
      ]
    })
  ];
  return gulp.src(src.css)
  // globパターンでのインポート機能を追加
  .pipe(sassGlob())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(postcss(plugins))
  .pipe(cleanCSS())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * サイト共通のJSファイルを連結・圧縮します。
 */
gulp.task('libJs', function() {
  return gulp.src(src.libJs)
  .pipe(sourcemaps.init())
  // ファイルを連結します。
  .pipe(concat('lib.js'))
  // ファイルを圧縮します。
  .pipe(uglify({preserveComments: 'license'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest.js))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * ModuleごとのJSファイルを連結・圧縮します。
 */
gulp.task('siteJs', function() {
  return gulp.src(src.siteJs)
  .pipe(sourcemaps.init())
  .pipe(concat('site.js'))
  .pipe(uglify({preserveComments: 'license'}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(dest.js))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * 画像を圧縮します。
 */
gulp.task('image', function() {
  return gulp.src(src.image)
  .pipe(changed(dest.image))
  // TODO: gulp-imageminのv3.2.0だとエラーが起きてしまうので、v2.4.0で固定しています。
  // https://github.com/imagemin/imagemin/issues/237
  .pipe(plumber({
    errorHandler: function(err) {
      console.log(err.messageFormatted);
      this.emit('end');
    }
  }))
  .pipe(imagemin({
    // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）。
    progressive: true,
    // gifをインターレースgifにします。
    interlaced: true,
    // PNGファイルの圧縮率（7が最高）を指定します。
    optimizationLevel: 7
  }))
  .pipe(gulp.dest(dest.image))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * アイコンフォントを作成します。
 * `src/assets/icon`にSVGファイルを保存すると、
 * `dest/assets/font`ディレクトリにフォントファイルが、
 * `src/assets/css/SiteWide`ディレクトリに専用のscssファイルが生成されます。
 */
gulp.task('iconfont', function() {
  // シンボルフォント名を指定します。
  var fontName = 'iconfont';
  return gulp.src(src.iconfont)
  .pipe(iconfont({
    fontName: fontName,
    formats: ['ttf', 'eot', 'woff', 'svg'],
  }))
  .on('glyphs', function(codepoints, opt) {
    var options = {
      glyphs: codepoints,
      fontName: fontName,
      // Sassファイルからfontファイルまでの相対パスを指定します。
      fontPath: '../font/',
    };
    // CSSのテンプレートからSassファイルを生成します。
    gulp.src('src/assets/icon/template/_Icon.scss')
    .pipe(consolidate('lodash', options))
    // Sassファイルの生成するパスを指定します。
    .pipe(gulp.dest('src/assets/css/base/mixin/'));
  })
  // fontファイルを出力するパスを指定します。
  .pipe(gulp.dest(dest.iconfont));
});

/**
 * スタイルガイドを生成します。
 */
gulp.task('styleguide', function() {
  return gulp.src('./aigis/aigis_config.yml')
    .pipe(aigis());
});

/**
 * Gulpの処理を通さないディレクトリです。
 * テスト用のディレクトリにコピーします。
 */
gulp.task('public', function() {
  return gulp.src(src.public)
  .pipe(gulp.dest(dest.root));
});

/**
 * 出力用のディレクトリを削除します。
 */
gulp.task('clean:dest', function (cb) {
  return rimraf(dest.root, cb);
});

/**
 * 一連のタスクを処理します。
 */
gulp.task('build', function() {
  runSequence(
    ['iconfont'],
    ['html', 'css', 'styleguide', 'libJs', 'siteJs', 'image', 'public']
  )
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      // SSIを利用する場合はmiddlewareのコメントアウトを解除します。
      // middleware: [
      //   ssi({
      //     baseDir: dest.root,
      //     ext: ".html"
      //   })
      // ],
      baseDir: dest.root
    },
    // 画面を共有するときにスクロールやクリックなどをミラーリングしたくない場合はfalseにします。
    ghostMode: true,
    // ローカルIPアドレスでサーバーを立ち上げます。
    open: 'external',
    // サーバー起動時に表示するページを指定します。
    startPath: '/styleguide/',
    // falseに指定すると、サーバー起動時にポップアップを表示させません。
    notify: false
  });
});

/**
 * ファイルを監視します。
 */
gulp.task('watch', ['build'], function() {
  gulp.watch(src.html, ['html']);
  gulp.watch(src.css, ['css']);
  gulp.watch(src.styleguideWatch, ['styleguide']);
  gulp.watch(src.jsWatch, ['libJs']);
  gulp.watch(src.jsWatch, ['siteJs']);
  gulp.watch(src.imageWatch, ['image']);
  gulp.watch(src.iconfontWath, ['iconfont']);
  gulp.watch(src.public, ['public']);
});


/**
 * 開発に使用するタスクです。
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', ['clean:dest'], function() {
  runSequence(
    'watch',
    'browser-sync'
  )
});

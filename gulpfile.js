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
var flexBugsFixes = require('postcss-flexbugs-fixes');
var autoprefixer = require('autoprefixer');
var cleanCSS = require('gulp-clean-css');

// JS
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');

// Image
var imagemin = require('gulp-imagemin');

// SVG sprite
var svgSprite = require('gulp-svg-sprite');

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
  'ssi': 'public/**/*.html',
  'data': 'src/_data/',
  'css': 'src/**/*.scss',
  'styleguideWatch': ['src/**/*.scss', 'src/**/*.md'],
  'js': 'src/assets/js/site.js',
  'image': 'src/assets/img/**/*.{png,jpg,gif,svg}',
  'imageWatch': 'src/assets/img/**/*',
  'svgSprite': 'src/assets/icon/**/*.svg',
  'public': 'public/**/*'
};

/**
 * テスト用ディレクトリ
 */
var dest = {
  'root': 'htdocs/',
  'image': 'htdocs/assets/img/',
  'js': 'htdocs/assets/js/',
  'svgSprite': 'htdocs/assets/img/svg/'
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
 * /public/以下のHTMLファイルを監視、更新があれば反映します。
 */
gulp.task('ssi', function() {
  return gulp.src(src.ssi)
  .pipe(browserSync.reload({stream: true}));
});

/**
 * `.scss`を`.css`にコンパイルします。
 */
gulp.task('css', function(){
  var plugins = [
    flexBugsFixes(),
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
 * ES2015以降のコードをES5に変換（トランスコンパイル）します。
 */
function bundle(watching = false) {
  const b = browserify({
    entries: src.js,
    transform: ['babelify'],
    debug: true,
    plugin: (watching) ? [watchify] : null
  })
  .on('update', function() {
    bundler();
    console.log('scripts rebuild');
  });

  function bundler() {
    return b.bundle()
      .on('error', function(err) {
        console.log(err.message);
      })
      .pipe(source('site.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify({output: {comments: /^!/}}))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dest.js))
      .pipe(browserSync.reload({stream: true}))
  }
  return bundler();
}

gulp.task('js', function() {
  bundle();
});

/**
 * 画像を圧縮します。
 */
gulp.task('image', function() {
  return gulp.src(src.image)
  .pipe(changed(dest.image))
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

gulp.task('svgSprite', function() {
  return gulp.src(src.svgSprite)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(svgSprite({
    mode: {
      // SVGファイルをsymbol要素としてまとめる。
      symbol: {
        dest: "./",
        // 出力するファイル名。
        sprite: "sprite.svg"
      }
    },
    shape: {
      transform: [{
        svgo: {
          plugins: [
            // `title`タグを削除する。
            {removeTitle: true},
            // `style`属性を削除する。
            {removeStyleElement: true},
            // `fill`属性を削除して、CSSで`fill`の変更ができるようにする。
            {removeAttrs: { attrs: "fill"}}
          ]
        }
      }]
    },
    svg: {
      // xml宣言を出力する。
      xmlDeclaration: true,
      // DOCTYPE宣言を出力する。
      doctypeDeclaration: false
    }
  }))
  .pipe(gulp.dest(dest.svgSprite))
  .pipe(browserSync.reload({stream: true}));
})

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
    ['html', 'ssi', 'css', 'styleguide', 'js', 'image', 'svgSprite', 'public']
  )
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      // SSIを使用します。
      middleware: [
        ssi({
          baseDir: dest.root,
          ext: ".html"
        })
      ],
      baseDir: dest.root
    },
    // 画面を共有するときにスクロールやクリックなどをミラーリングしたくない場合はfalseにします。
    ghostMode: false,
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
  gulp.watch(src.ssi, ['ssi']);
  gulp.watch(src.public, ['public']);
  gulp.watch(src.html, ['html']);
  gulp.watch(src.css, ['css']);
  gulp.watch(src.styleguideWatch, ['styleguide']);
  bundle(true);
  gulp.watch(src.imageWatch, ['image']);
  gulp.watch(src.svgSprite ['svgSprite']);
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

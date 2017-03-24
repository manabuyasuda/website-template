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
var csswring = require('csswring');

// Iconfont
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

// Utility
var cache = require('gulp-cached');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var rimraf = require('rimraf');

/**
 * 開発用ディレクトリ
 */
var develop = {
  'html': ['develop/**/*.pug', '!develop/**/_*.pug'],
  'data': 'develop/_data/',
  'css': 'develop/**/*.scss',
  'iconfont': 'develop/assets/icon/**/*.svg'
};

/**
 * テスト用ディレクトリ
 */
var test = {
  'root': 'test/',
  'iconfont': 'test/assets/font/'
};

/**
 * 本番用ディレクトリ
 */
var release = {
  'root': 'htdocs/'
};

/**
 * `.pug`を`.html`にコンパイルします。
 * JSONとページごとのルート相対パスの格納、ルート相対パスを使ったincludeの設定をします。
 */
gulp.task('html', function() {
  // JSONファイルの読み込み。
  var locals = {
    // `site.hoge`でデータを取得できます。
    'site': JSON.parse(fs.readFileSync(develop.data + 'site.json'))
  }
  return gulp.src(develop.html)
    // エラーでタスクを止めない
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(data(function(file) {
      // 各ページごとの`/`を除いたルート相対パスを取得します。
      locals.relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html'));
        return locals;
    }))
    .pipe(cache('pug'))
    .pipe(pug({
      // `locals`に渡したデータを各Pugファイルで取得できます。
      locals: locals,
      // ルート相対パスでincludeが使えるようになります。
      // example: /assets/pug/_layout
      basedir: 'develop',
      // Pugファイルの整形。
      pretty: true
    }))
    .pipe(gulp.dest(test.root))
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
      browsers: [
        // Major Browsersの最新2バージョン
        'last 2 version',
        // IE9以上
        'ie >= 9',
        // iOS8以上
        'iOS >= 8',
        // Android4.4以上
        'Android >= 4.4'
      ]
    }),
    // ホワイトスペースや省略可能なコードの削除（最適化）
    csswring({
      // CSSハックを削除しないようにする
      preserveHacks: true
    })
  ];
  return gulp.src(develop.css)
  // globパターンでのインポート機能を追加
  .pipe(sassGlob())
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(postcss(plugins))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(test.root))
  .pipe(browserSync.reload({stream: true}));
});

/**
 * アイコンフォントを作成します。
 * `develop/assets/icon`にSVGファイルを保存すると、
 * `test/assets/font`ディレクトリにフォントファイルが、
 * `develop/assets/css/SiteWide`ディレクトリに専用のscssファイルが生成されます。
 */
gulp.task('iconfont', function() {
  // シンボルフォント名を指定します。
  var fontName = 'iconfont';
  return gulp.src(develop.iconfont)
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
      // CSSのクラス名を指定します。
      className: 'sw-Icon'
    };
    // CSSのテンプレートからSassファイルを生成します。
    gulp.src('develop/assets/icon/template/_Icon.scss')
    .pipe(consolidate('lodash', options))
    // Sassファイルの生成するパスを指定します。
    .pipe(gulp.dest('develop/assets/css/SiteWide/'));
    // アイコンフォントのサンプルHTMLを生成します。
    gulp.src('develop/assets/icon/template/Icon.html')
    .pipe(consolidate('lodash', options))
    // アイコンフォントのサンプルHTMLを生成するパスを指定します。
    .pipe(gulp.dest('test/styleguide/'))
  })
  // fontファイルを出力するパスを指定します。
  .pipe(gulp.dest(test.iconfont));
});

/**
 * testディレクトリを削除します。
 */
gulp.task('clean:test', function (cb) {
  rimraf(test.root, cb);
});

/**
 * 本番用ディレクトリを削除します。
 */
gulp.task('clean:release', function (cb) {
  rimraf(release.root, cb);
});

/**
 * 一連のタスクを処理します。
 */
gulp.task('build', function() {
  runSequence(
    ['iconfont'],
    ['html', 'css']
    )
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: test.root,
      index: "index.html"
    }
  });
});

/**
 * ファイルを監視します。
 */
gulp.task('watch', ['build'], function() {
  gulp.watch(develop.html, ['html']);
  gulp.watch(develop.css, ['css']);
  gulp.watch(develop.iconfont, ['iconfont']);
});


/**
 * 開発に使用するタスクです。
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', ['clean:test'], function() {
  runSequence(
    'watch',
    'browser-sync'
  )
});

/**
 * 本番用ファイルを出力します。
 */
gulp.task('release', ['clean:release'], function() {
  return gulp.src(test.root + '**/*')
    .pipe(gulp.dest(release.root));
});

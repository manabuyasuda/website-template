var gulp = require('gulp');

// Pug
var pug = require('gulp-pug');
var fs = require('fs');
var data = require('gulp-data');
var path = require('path');

// Utility
var cache = require('gulp-cached');
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
  'data': 'develop/_data/'
};

/**
 * テスト用ディレクトリ
 */
var test = {
  'root': 'test/',
  'pug': 'test/'
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
    'html'
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

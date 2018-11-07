const gulp = require('gulp');

// Pug
const pug = require('gulp-pug');
const fs = require('fs');
const data = require('gulp-data');
const path = require('path');

// HTML
const htmlhint = require('gulp-htmlhint');
const ssi = require('browsersync-ssi');

// CSS
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const flexBugsFixes = require('postcss-flexbugs-fixes');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gulpStylelint = require('gulp-stylelint');

// JS
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const vueify = require('vueify');
const envify = require('envify/custom');

// Image
const imagemin = require('gulp-imagemin');

// SVG sprite
const svgSprite = require('gulp-svg-sprite');

// Styleguide
const aigis = require('gulp-aigis');

// Utility
const cache = require('gulp-cached');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');
const rimraf = require('rimraf');

/**
 * 開発用ディレクトリ
 */
const src = {
  root: 'src/',
  html: ['src/**/*.pug', '!src/**/_*.pug'],
  ssi: 'public/**/*.html',
  data: 'src/_data/',
  css: 'src/**/*.scss',
  styleguideWatch: ['src/**/*.scss', 'src/**/*.md'],
  js: 'src/assets/js/site.js',
  jsWatch: 'src/**/*.js',
  image: 'src/assets/img/**/*.{png,jpg,gif,svg}',
  imageWatch: 'src/assets/img/**/*',
  svgSprite: 'src/assets/svg/**/*.svg',
  public: 'public/**/*',
};

/**
 * テスト用ディレクトリ
 */
const dest = {
  root: 'htdocs/',
  image: 'htdocs/assets/img/',
  js: 'htdocs/assets/js/',
  svgSprite: 'htdocs/assets/svg/',
};

/**
 * 環境変数を設定します。
 */
const env = process.env.APP_ENV;
const developmentValues = require('./env/development').defaults;
const productionValues = require('./env/production').defaults;

const envValues = env === 'development' ? developmentValues : productionValues;
const isDevelopment = (envValues.NODE_ENV === 'development');
const isProduction = (envValues.NODE_ENV === 'production');

/**
 * `.pug`を`.html`にコンパイルします。
 * JSONとページごとのルート相対パスの格納、ルート相対パスを使ったincludeの設定をします。
 */
gulp.task('html', () => {
  // JSONファイルの読み込み。
  const locals = {
    site: JSON.parse(fs.readFileSync(`${src.data}site.json`)),
  };
  locals.ja = {
    // 日本語サイト共通のデータです。
    site: JSON.parse(fs.readFileSync(`${src.data}ja/site.json`)),
  };
  locals.en = {
    // 英語サイト共通のデータです。
    site: JSON.parse(fs.readFileSync(`${src.data}en/site.json`)),
  };
  return gulp.src(src.html)
  // エラーでタスクを止めない
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(data((file) => {
    // 各ページのルート相対パスを格納します。
      locals.pageAbsolutePath = `/${path.relative(file.base, file.path.replace(/.pug$/, '.html')).replace(/index\.html$/, '')}`;
      return locals;
    }))
    .pipe(cache('html'))
    .pipe(pug({
    // `locals`に渡したデータを各Pugファイルで取得できます。
      locals,
      // ルート相対パスでincludeが使えるようにします。
      basedir: 'src',
      // Pugファイルの整形。
      pretty: true,
    }))
    .pipe(gulp.dest(dest.root))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * 公開用のHTMLファイルを解析して警告やエラーを通知します。
 */
gulp.task('htmlhint', () => gulp.src([`${dest.root}**/*.html`, `!${dest.root}styleguide/**/*.html`])
  .pipe(htmlhint('.htmlhintrc'))
  .pipe(htmlhint.reporter('htmlhint-stylish'))
  .pipe(htmlhint.failOnError({
    suppress: true,
  })));

/**
 * /public/以下のHTMLファイルを監視、更新があれば反映します。
 */
gulp.task('ssi', () => gulp.src(src.ssi)
  .pipe(browserSync.reload({ stream: true })));

/**
 * 公開用のSassファイルを解析して警告やエラーを通知します。
 * 修正できるものは強制的に反映します。
 */
gulp.task('stylelint', () => gulp.src(src.css)
  .pipe(gulpStylelint({
    fix: true,
  }))
  .pipe(gulp.dest(src.root)));

/**
 * `.scss`を`.css`にコンパイルします。
 */
gulp.task('css', () => {
  const plugins = [
    flexBugsFixes(),
    autoprefixer(),
  ];
  return gulp.src(src.css)
  // globパターンでのインポート機能を追加
    .pipe(sassGlob())
    .pipe(gulpif(isDevelopment, sourcemaps.init()))
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', sass.logError))
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(postcss(plugins))
    .pipe(gulpif(isProduction, cleanCSS()))
    .pipe(gulpif(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest.root))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * ES2015以降のコードをES5に変換（トランスコンパイル）します。
 */
gulp.task('js', () => {
  const envifyOptions = envValues;
  // 指定した環境変数だけを処理する
  envifyOptions._ = 'purge';

  browserify({
    entries: src.js,
    extensions: ['.js'],
    // browserifyのsourcemapsを使用しない
    debug: !!(isDevelopment),
    cache: {},
    packageCache: {},
    // ファイルの状態を監視して、差分だけをビルドする
    plugin: 'watchify',
  })
    .transform(babelify)
    // Vue.jsの単一ファイルコンポーネントをBrowserifyで変換する
    .transform(vueify)
    .transform(
      { global: true },
      // `NODE_ENV`を`development`か`production`に変更する
      // 環境変数もすべてJS側に渡す
      envify(envifyOptions),
    )
    .bundle()
    .on('error', function (err) {
      console.log(`Error : ${err.message}`);
      this.emit('end');
    })
    .pipe(source('site.js'))
    .pipe(buffer())
    .pipe(gulpif(isProduction, uglify({ output: { comments: /^!/ } })))
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * 画像を圧縮します。
 */
gulp.task('image', () => gulp.src(src.image)
  .pipe(changed(dest.image))
  .pipe(plumber({
    errorHandler(err) {
      console.log(err.messageFormatted);
      this.emit('end');
    },
  }))
  .pipe(imagemin({
    // jpgをロスレス圧縮（画質を落とさず、メタデータを削除）。
    progressive: true,
    // gifをインターレースgifにします。
    interlaced: true,
    // PNGファイルの圧縮率（7が最高）を指定します。
    optimizationLevel: 7,
  }))
  .pipe(gulp.dest(dest.image))
  .pipe(browserSync.reload({ stream: true })));

/**
 * SVGファイルからSVGスプライトを生成します。
 */
gulp.task('svgSprite', () => gulp.src(src.svgSprite)
  .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
  .pipe(svgSprite({
    mode: {
      // SVGファイルをsymbol要素としてまとめる。
      symbol: {
        dest: './',
        // 出力するファイル名。
        sprite: 'sprite.svg',
      },
    },
    shape: {
      transform: [{
        svgo: {
          plugins: [
            // `title`タグを削除する。
            { removeTitle: true },
            // `style`属性を削除する。
            { removeStyleElement: true },
            // `fill`属性を削除して、CSSで`fill`の変更ができるようにする。
            { removeAttrs: { attrs: 'fill' } },
          ],
        },
      }],
    },
    svg: {
      // xml宣言を出力する。
      xmlDeclaration: true,
      // DOCTYPE宣言を出力する。
      doctypeDeclaration: false,
    },
  }))
  .pipe(gulp.dest(dest.svgSprite))
  .pipe(browserSync.reload({ stream: true })));

/**
 * スタイルガイドを生成します。
 */
gulp.task('styleguide', () => gulp.src('./aigis/aigis_config.yml')
  .pipe(aigis()));

/**
 * Gulpの処理を通さないディレクトリです。
 * 公開用のディレクトリにコピーします。
 */
gulp.task('public', () => gulp.src(src.public)
  .pipe(gulp.dest(dest.root)));

/**
 * 公開用のディレクトリを削除します。
 */
gulp.task('clean:dest', cb => rimraf(dest.root, cb));

/**
 * 一連のタスクを処理します。
 */
gulp.task('build', () => {
  runSequence(
    ['html', 'ssi', 'css', 'styleguide', 'js', 'image', 'svgSprite', 'public'],
  );
});

/**
 * ローカルサーバーを起動します。
 */
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      // SSIを使用します。
      middleware: [
        ssi({
          baseDir: dest.root,
          ext: '.html',
        }),
      ],
      baseDir: dest.root,
    },
    // 画面を共有するときにスクロールやクリックなどをミラーリングしたくない場合はfalseにします。
    ghostMode: false,
    // ローカルIPアドレスでサーバーを立ち上げます。
    open: 'external',
    // サーバー起動時に表示するページを指定します。
    startPath: '/styleguide/',
    // falseに指定すると、サーバー起動時にポップアップを表示させません。
    notify: false,
  });
});

/**
 * ファイルを監視します。
 */
gulp.task('watch', ['build'], () => {
  gulp.watch(src.ssi, ['ssi']);
  gulp.watch(src.public, ['public']);
  gulp.watch(src.html, ['html']);
  gulp.watch(src.css, ['css']);
  gulp.watch(src.styleguideWatch, ['styleguide']);
  gulp.watch(src.jsWatch, ['js']);
  gulp.watch(src.imageWatch, ['image']);
  gulp.watch(src.svgSprite, ['svgSprite']);
});

/**
 * 開発に使用するタスクです。
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', ['clean:dest'], () => {
  runSequence(
    'watch',
    'browser-sync',
  );
});

const gulp = require('gulp');

// Pug
const pug = require('gulp-pug');
const fs = require('fs');
const data = require('gulp-data');
const path = require('path');

// HTML
const htmlhint = require('gulp-htmlhint');
const w3cjs = require('gulp-w3cjs');
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
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const vueify = require('vueify');
const envify = require('envify/custom');

// Image
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

// SVG sprite
const svgSprite = require('gulp-svg-sprite');

// Styleguide
const aigis = require('gulp-aigis');

// Utility
const cache = require('gulp-cached');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gulpif = require('gulp-if');
const del = require('del');

/**
 * 開発用ディレクトリ
 */
const src = {
  root: 'src/',
  html: ['src/**/*.pug', '!src/**/_*.pug'],
  ssi: 'static/**/*.html',
  data: 'src/_data/',
  css: 'src/**/*.scss',
  styleguideWatch: ['src/**/*.scss', 'src/**/*.md'],
  js: './src/assets/js/site.js',
  jsWatch: 'src/**/*.js',
  image: 'src/assets/img/**/*.{png,jpg,gif,svg}',
  imageWatch: 'src/assets/img/**/*',
  svgSprite: 'src/assets/svg/**/*.svg',
  static: 'static/**/*',
};

/**
 * テスト用ディレクトリ
 */
const dest = {
  root: 'htdocs/',
  image: 'htdocs/assets/img/',
  js: 'assets/js/',
  svgSprite: 'htdocs/assets/svg/',
  cleanDest: 'htdocs/',
};

/**
 * 環境変数を設定します。
 */
const env = process.env.APP_ENV;
const developmentValues = require('./config/development').defaults;
const productionValues = require('./config/production').defaults;

const envValues = env === 'development' ? developmentValues : productionValues;
const isDevelopment = envValues.NODE_ENV === 'development';
const isProduction = envValues.NODE_ENV === 'production';

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
  return (
    gulp
      .src(src.html)
      // エラーでタスクを止めない
      .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
      .pipe(
        data(file => {
          // 各ページのルート相対パスを格納します。
          locals.pageAbsolutePath = `/${path
            .relative(file.base, file.path.replace(/.pug$/, '.html'))
            .replace(/index\.html$/, '')}`;
          return locals;
        }),
      )
      .pipe(cache('html'))
      .pipe(
        pug({
          // `locals`に渡したデータを各Pugファイルで取得できます。
          locals,
          // ルート相対パスでincludeが使えるようにします。
          basedir: 'src',
          // Pugファイルの整形。
          pretty: true,
        }),
      )
      .pipe(gulp.dest(dest.root))
      .pipe(browserSync.reload({ stream: true }))
  );
});

/**
 * 公開用のHTMLファイルを解析して警告やエラーを通知します。
 */
// 範囲を限定する場合は`products/`などと指定します。
const validateDir = '';
gulp.task('htmlValidate', () =>
  gulp
    .src([`${dest.root}${validateDir}**/*.html`, `!${dest.root}styleguide/**/*.html`])
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter('htmlhint-stylish'))
    .pipe(
      w3cjs({
        // Warningも表示する
        // showInfo: true,
      }),
    )
    .pipe(
      htmlhint.failOnError({
        suppress: true,
      }),
    ),
);

/**
 * /static/以下のHTMLファイルを監視、更新があれば反映します。
 */
gulp.task('ssi', () => gulp.src(src.ssi).pipe(browserSync.reload({ stream: true })));

/**
 * 公開用のSassファイルを解析して警告やエラーを通知します。
 * 修正できるものは強制的に反映します。
 */
gulp.task('stylelint', () =>
  gulp
    .src(src.css)
    .pipe(
      gulpStylelint({
        fix: true,
        reporters: [{ formatter: 'string', console: true }],
      }),
    )
    .pipe(gulp.dest(src.root)),
);

/**
 * `.scss`を`.css`にコンパイルします。
 */
gulp.task('css', () => {
  const plugins = [flexBugsFixes(), autoprefixer()];
  return (
    gulp
      .src(src.css)
      // globパターンでのインポート機能を追加
      .pipe(sassGlob())
      .pipe(gulpif(isDevelopment, sourcemaps.init()))
      .pipe(
        sass({
          outputStyle: 'expanded',
        }).on('error', sass.logError),
      )
      .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
      .pipe(postcss(plugins))
      .pipe(
        gulpif(
          isDevelopment,
          cleanCSS({
            // 圧縮せずに整形して出力する
            format: 'beautify',
            compatibility: {
              properties: {
                // 0の単位を不必要な場合は削除する
                zeroUnits: false,
              },
            },
          }),
        ),
      )
      .pipe(
        gulpif(
          isProduction,
          cleanCSS({
            compatibility: {
              properties: {
                // 0の単位を不必要な場合は削除する
                zeroUnits: false,
              },
            },
          }),
        ),
      )
      .pipe(gulpif(isDevelopment, sourcemaps.write()))
      .pipe(gulp.dest(dest.root))
      .pipe(browserSync.reload({ stream: true }))
  );
});

/**
 * ES2015以降のコードをES5に変換（トランスコンパイル）します。
 */
gulp.task('js', () => {
  return gulp
    .src(src.js)
    .pipe(webpackStream({
      mode: envValues.NODE_ENV,
      entry: {
        site: src.js,
      },
      output: {
        filename: `${dest.js}[name].js`,
      },
    }))
    .pipe(gulp.dest(dest.root))
    .pipe(browserSync.reload({ stream: true }))
});

/**
 * 画像を圧縮します。
 */
gulp.task('image', () =>
  gulp
    .src(src.image)
    .pipe(changed(dest.image))
    .pipe(
      plumber({
        errorHandler(err) {
          // eslint-disable-next-line no-console
          console.log(err.messageFormatted);
          this.emit('end');
        },
      }),
    )
    .pipe(
      imagemin([
        imageminMozjpeg({
          // 画質
          quality: 70,
        }),
        imageminPngquant({
          // 画質
          quality: [0.7, 0.8],
        }),
        imagemin.svgo({
          plugins: [
            // viewBox属性を削除する（widthとheight属性がある場合）。
            // 表示が崩れる原因になるので削除しない。
            { removeViewBox: false },
            // <metadata>を削除する。
            // 追加したmetadataを削除する必要はない。
            { removeMetadata: false },
            // SVGの仕様に含まれていないタグや属性、id属性やvertion属性を削除する。
            // 追加した要素を削除する必要はない。
            { removeUnknownsAndDefaults: false },
            // コードが短くなる場合だけ<path>に変換する。
            // アニメーションが動作しない可能性があるので変換しない。
            { convertShapeToPath: false },
            // 重複や不要な`<g>`タグを削除する。
            // アニメーションが動作しない可能性があるので変換しない。
            { collapseGroups: false },
            // SVG内に<style>や<script>がなければidを削除する。
            // idにアンカーが貼られていたら削除せずにid名を縮小する。
            // id属性は動作の起点となることがあるため削除しない。
            { cleanupIDs: false },
          ],
        }),
        imagemin.optipng(),
        imagemin.gifsicle(),
      ]),
    )
    .pipe(gulp.dest(dest.image))
    .pipe(browserSync.reload({ stream: true })),
);

/**
 * SVGファイルからSVGスプライトを生成します。
 */
gulp.task('svgSprite', () =>
  gulp
    .src(src.svgSprite)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(
      svgSprite({
        mode: {
          // SVGファイルをsymbol要素としてまとめる。
          symbol: {
            dest: './',
            // 出力するファイル名。
            sprite: 'sprite.svg',
          },
        },
        shape: {
          transform: [
            {
              svgo: {
                plugins: [
                  // `style`属性を削除する。
                  { removeStyleElement: true },
                  // `fill`属性を削除して、CSSで`fill`の変更ができるようにする。
                  { removeAttrs: { attrs: 'fill' } },
                ],
              },
            },
          ],
        },
        svg: {
          // xml宣言を出力する。
          xmlDeclaration: false,
          // DOCTYPE宣言を出力する。
          doctypeDeclaration: false,
        },
      }),
    )
    .pipe(gulp.dest(dest.svgSprite))
    .pipe(browserSync.reload({ stream: true })),
);

/**
 * スタイルガイドを生成します。
 */
gulp.task('styleguide', () => gulp.src('./aigis/aigis_config.yml').pipe(aigis()));

/**
 * Gulpの処理を通さないディレクトリです。
 * 公開用のディレクトリにコピーします。
 */
gulp.task('static', () => gulp.src(src.static).pipe(gulp.dest(dest.root)));

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
 * 公開用のディレクトリを削除します。
 */
gulp.task('clean:dest', done => del(dest.cleanDest, done));

/**
 * 一連のタスクを処理します。
 */
gulp.task(
  'build',
  gulp.series('html', 'ssi', 'css', 'styleguide', 'js', 'image', 'svgSprite', 'static'),
);

/**
 * ファイルを監視します。
 */
gulp.task('watch', () => {
  gulp.watch(src.ssi, gulp.task('ssi'));
  gulp.watch(src.static, gulp.task('static'));
  gulp.watch(src.html, gulp.task('html'));
  gulp.watch(src.css, gulp.task('css'));
  gulp.watch(src.styleguideWatch, gulp.task('styleguide'));
  gulp.watch(src.jsWatch, gulp.task('js'));
  gulp.watch(src.imageWatch, gulp.task('image'));
  gulp.watch(src.svgSprite, gulp.task('svgSprite'));
});

/**
 * 開発に使用するタスクです。
 * `gulp`タスクにbrowser-syncを追加します。
 * ローカルサーバーを起動し、リアルタイムに更新を反映させます。
 */
gulp.task('default', gulp.series('clean:dest', 'build', gulp.parallel('browser-sync', 'watch')));

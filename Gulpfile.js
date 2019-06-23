const babel = require('gulp-babel');
const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');

const { join } = path;
const ROOT = process.cwd();
const SRC = join(ROOT, 'src');
const BUILD = join(ROOT, 'build');
const tsCompiler = ts.createProject(join(ROOT, 'tsconfig.json'));

gulp.task('compile', () => {
  return gulp
    .src(BUILD, { read: true, allowEmpty: true })
    .pipe(clean())
    .pipe(tsCompiler.src())
    .pipe(sourcemaps.init())
    .pipe(tsCompiler())
    .js.pipe(
      babel({
        configFile: join(ROOT, 'babel.config.js'),
      }),
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(BUILD));
});

gulp.task('nodemon', () => {
  return nodemon({
    script: join(BUILD, 'test.js'),
    watch: SRC,
    ext: 'ts',
    tasks: ['compile'],
    done: false,
  });
});

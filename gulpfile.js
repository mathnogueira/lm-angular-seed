// jshint node: true 

const gulp = require('gulp');
const babel = require('gulp-babel');
const inject = require('gulp-inject');
const pug = require('gulp-pug');
const debug = require('gulp-debug');
const order = require('gulp-order');
const runSequence = require('run-sequence');
const less = require('gulp-less');
const ignore = require('gulp-ignore');
const rename = require('gulp-rename');
const bowerFiles = require('main-bower-files');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const watch = require('gulp-watch');

// Define the priorities of js files for injection
// The earlier in the array, the earlier it will be injected.
let jsFilesPriorities = [
    '**/*.decorator.js',
    '**/*.module.js',
    '**/*.routes.js',
    '**/*.js'
];

gulp.task('babel', compileUsingBabel);
gulp.task('pug', compilePug);
gulp.task('less', compileLess);
gulp.task('index', compileIndex);
gulp.task('dependencies', buildDependencies);
gulp.task('build', buildApplication);
gulp.task('jshint', runJshint);
gulp.task('watch', ['watch-js', 'watch-pug', 'watch-index', 'watch-less', 'watch-less-components']);
gulp.task('watch-js', watchJs);
gulp.task('watch-pug', watchPug);
gulp.task('watch-less', watchLess);
gulp.task('watch-less-components', watchLessPartials);
gulp.task('watch-index', watchIndex);
gulp.task('fonts', copyFonts);

function buildApplication() {
    runSequence(['pug', 'less', 'dependencies', 'jshint', 'fonts'], 'babel', 'index');
}

function buildDependencies() {
    return gulp
        .src(bowerFiles())
        .pipe(ignore.include('**/*.js'))
        .pipe(concat('dependencies.js'))
        .pipe(gulp.dest('build/libs/'));
}

function compileUsingBabel() {
    return gulp
        .src('app/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('build/app'));
}

function runJshint() {
    return gulp
        .src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
}

function compilePug() {
    let config = { pretty: true };
    return gulp
        .src('app/**/*.pug')
        .pipe(pug(config))
        .pipe(gulp.dest('build/app'));
}

function compileIndex() {
    // Js files to inject
    let jsFiles = gulp
        .src('app/**/*.js')
        .pipe(order(jsFilesPriorities));

    // Css files to inject
    let cssFiles = gulp
        .src('build/**/*.css', { cwd: '.', base: './', read: false })
        .pipe(rename(removeBase));

    let depFiles = gulp
        .src('build/libs/**/*.js', { cwd: '.', base: './', read: false })
        .pipe(rename(removeBase));

    return gulp
        .src('index.pug')
        .pipe(pug({ pretty: true }))
        .pipe(inject(jsFiles, { addRootSlash: false }))
        .pipe(inject(cssFiles, { addRootSlash: false }))
        .pipe(inject(depFiles, { addRootSlash: false, name: 'bower' }))
        .pipe(gulp.dest('build/'));
}

function removeBase(opt) {
    opt.dirname = opt.dirname.replace('build/', '');
    return opt;
}

function compileLess() {
    return gulp
        .src('./style/**/*.less')
        .pipe(ignore('**/_*.less'))
        .pipe(less())
        .pipe(gulp.dest('build/style/'));
}

function watchJs() {
    return watch('app/**/*.js')
        .pipe(debug({ title: 'JS WATCH:'}))
        .pipe(babel())
        .pipe(gulp.dest('build/app'));
}

function watchPug() {
    return watch('app/**/*.pug')
        .pipe(debug({ title: 'PUG WATCH:'}))
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build/app'));
}

function watchIndex() {
    return watch('index.pug', compileIndex)
        .pipe(debug({ title: 'INDEX WATCH:'}));
}

function watchLess() {
    return watch('style/**/*.less', compileLess)
        .pipe(debug({ title: 'LESS WATCH:'}))
        .pipe(less())
        .pipe(gulp.dest('build/style/'));
}

function watchLessPartials() {
     return watch('style/**/_*.less', compileLess)
        .pipe(debug({ title: 'LESS COMPONENTS WATCH:'}));
}

function copyFonts() {
    return gulp
        .src('./bower_components/font-awesome/fonts/**/*')
        .pipe(gulp.dest('./build/fonts/'));
}
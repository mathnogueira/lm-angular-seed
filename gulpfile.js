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

function buildApplication() {
    runSequence(['pug', 'less', 'dependencies', 'jshint'], 'babel', 'index');
}

function buildDependencies() {
    return gulp
        .src(bowerFiles())
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
        .src('**/*.css', { cwd: '.', base: './', read: false })
        .pipe(rename(removeBase))
        .pipe(ignore('node_modules/**'))
        .pipe(ignore('bower_components/**'));

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
        .src('./**/*.less')
        .pipe(ignore('**/_*.less'))
        .pipe(ignore('node_modules/**'))
        .pipe(ignore('bower_components/**'))
        .pipe(less())
        .pipe(gulp.dest('build/style/'));
}

function renameLessToCss(opt) {
    opt.extname = opt.extname.replace(/^\.less$/, '.css');
    return opt;
}
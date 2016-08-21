'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var libs = [
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/jquery.cookie/jquery.cookie.js",
    "bower_components/underscore/underscore.js",
    "bower_components/icanhaz/ICanHaz.min.js",
    "bower_components/backbone/backbone-min.js"
];

gulp.task('out', function(){
    return gulp.src(["public/javascripts/src/**/*.js"])
        .pipe(concat('main.js'))
        .pipe(gulp.dest("public/javascripts/out"))
});

gulp.task('libs', function(){
    return gulp.src(libs)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest("public/javascripts/out"))
});

gulp.task('dist', ['out', 'libs']);

gulp.task('sass', function () {
    gulp.src('public/stylesheets/src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concatCss('style.css'))
        .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('watch', function () {
    watch('public/javascripts/src/**/*.js', batch(function (events, done) {
        gulp.start('dist', done);
    }));
    watch('public/stylesheets/src/**/*.scss', batch(function (events, done) {
        gulp.start('sass', done);
    }));
});


gulp.task('default', ['sass', 'dist']);
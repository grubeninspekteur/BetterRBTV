var gulp = require('gulp');
var filter = require('gulp-filter');
var rename = require("gulp-rename");
var zip = require('gulp-zip');
var jeditor = require('gulp-json-editor');

var version = require('./src/manifest.json').version;
var config = require('./config.json')

gulp.task('chrome', function () {
    var manifestFilter = filter('**/manifest.json', {restore: true});
    var constantsFilter = filter('**/constants_c.js', {restore: true});
    return gulp.src(['./src/**', '!./src/constants.js', '!./src/constants_ff.js'])
        .pipe(constantsFilter)
        .pipe(rename('constants.js'))
        .pipe(constantsFilter.restore)
        .pipe(zip('better-rbtv-' + version + '.zip'))
        .pipe(gulp.dest('./dist/chrome'));
});

gulp.task('firefox', function () {
    var manifestFilter = filter('**/manifest.json', {restore: true});
    var constantsFilter = filter('**/constants_ff.js', {restore: true});
    return gulp.src(['./src/**', '!./src/constants.js', '!./src/constants_c.js'])
        .pipe(manifestFilter)
        .pipe(jeditor({
            'applications': {
                'gecko': {
                    'id': config.firefoxId
                }
            }
        }))
        .pipe(manifestFilter.restore)
        .pipe(constantsFilter)
        .pipe(rename('constants.js'))
        .pipe(constantsFilter.restore)
        .pipe(zip('better-rbtv-' + version + '.zip'))
        .pipe(gulp.dest('./dist/firefox'));
});

gulp.task('dist', ['chrome', 'firefox']);

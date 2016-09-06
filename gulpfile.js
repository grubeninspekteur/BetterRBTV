var gulp = require('gulp');
var filter = require('gulp-filter');
var zip = require('gulp-zip');
var gulpSequence = require('gulp-sequence')
var jeditor = require('gulp-json-editor');

var prompt = require('inquirer').prompt;
var semver = require('semver');

var version = require('./src/manifest.json').version;
var config = require('./config.json')

gulp.task('updateManifest', function() {
  var newSemver = {
    patch: semver.inc(version, 'patch') || '0.0.1',
    minor: semver.inc(version, 'minor') || '0.1.0',
    major: semver.inc(version, 'major') || '1.0.0'
  }
  return prompt({
      type: 'list',
      name: 'bump',
      message: 'What type of version bump would you like to do ? (current version is ' + version + ')',
      choices: [
        'patch => ' + newSemver.patch,
        'minor => ' + newSemver.minor,
        'major => ' + newSemver.major,
        'none => ' + version
      ]
    }, function(res) {
      version = newSemver[res.bump.split(' ')[0]] || version;
      return gulp.src('./src/manifest.json')
        .pipe(jeditor({
          'version': version
        }))
        .pipe(gulp.dest('./src/'))
    });
});

gulp.task('chrome', function() {
  return gulp.src('./src/**')
    .pipe(zip('better-rbtv-' + version + '.zip'))
    .pipe(gulp.dest('./dist/chrome'));
});

gulp.task('firefox', function() {
  var manifestFilter = filter('**/manifest.json', {restore: true});
  return gulp.src('./src/**')
    .pipe(manifestFilter)
    .pipe(jeditor({
      'applications': {
        'gecko': {
          'id': config.firefoxId
        }
      }
    }))
    .pipe(manifestFilter.restore)
    .pipe(zip('better-rbtv-' + version + '.zip'))
    .pipe(gulp.dest('./dist/firefox'));
});

gulp.task('dist', gulpSequence('updateManifest', ['chrome', 'firefox']));

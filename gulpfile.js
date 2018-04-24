var gulp = require('gulp');
// var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
// var uglify = require('gulp-uglify');

var scriptTarget = 'd://job/2015/witbpm/V1.1/Source/WebUI/WitBPM.Web/WitBPM.Web/Scripts/witui/process/design/release';
var cssTarget = 'd://job/2015/witbpm/V1.1/Source/WebUI/WitBPM.Web/WitBPM.Web/Themes/default/witui/process/default/css';

gulp.task('move:scripts', function () {
	return gulp.src('release/*.js')
		.pipe(plumber())
		.pipe(gulp.dest(scriptTarget));
});

gulp.task('move:css', function () {
	return gulp.src('release/*.css')
		.pipe(plumber())
		.pipe(gulp.dest(cssTarget));
});

gulp.task('watch', function () {
		return gulp.watch(
			['example/demo.html'],
			['move:scripts', 'move:css']
		);
	});

'use strict';

let gulp = require('gulp'),
	gulpsync = require('gulp-sync')(gulp),
	clean = require('gulp-clean'),
	browser = require('browser-sync').create(),
	sass = require('gulp-sass'),
	minifycss = require('gulp-minify-css'),
	sourcemaps = require('gulp-sourcemaps'),
	prefix = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	babel = require('gulp-babel'),
	polyfill = require("@babel/polyfill"),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	changed = require('gulp-changed'),
	rigger = require('gulp-rigger'),
	ghPages = require('gulp-gh-pages'),
	requiredFiles = ['src/js/main.js']

let path = {
	src: {
		html: './src/**/*.html',
		php: './src/**/*.php',
		inc: './src/inc/**/*.html',
		js: './src/js/*.js',
		js_min: './src/js/**/*.min.js',
		style: {
			sass: './src/sass/**/*.{scss,sass}',
			css: './src/css/**/*.css',
			css_min: './src/css/**/*.min.css',
		},
		css: './src/css',
		img: './src/images/**/*.*',
		fonts: './src/fonts/**/*.*'
	},
	public: {
		folder: './public/',
		html: './public/**/*.html',
		js: './public/js/',
		css: './public/css/',
		style: {
			css: './public/css/**/*.css',
			css_min: './public/css/**/*.min.css',
		},
		img: './public/images/',
		fonts: './public/fonts/'
	}
};

gulp.task('default', gulpsync.sync(['clean', ['html', 'styles', 'minify', 'js', 'js2', 'fonts', 'images', 'imageanimate', 'browser', 'watch']]));


gulp.task('browser', () => {
	browser.init({
		server: {
			baseDir: path.public.folder,
			injectChanges: true
		}
	});
});

gulp.task('clean', () => {
	return gulp.src(path.public.folder, {read: false})
		.pipe(clean());
});

gulp.task('deploy', function() {
	return gulp.src(path.public.folder+'**/*')
		.pipe(ghPages());
});

gulp.task('html', () => {
	return gulp.src([path.src.html, '!'+path.src.inc, path.src.php])
		.pipe(rigger())
		.pipe(gulp.dest(path.public.folder));
});

function swallowError(error) {
	console.log(error.toString());
	this.emit('end');
}

gulp.task('styles', () => {
	gulp.src(path.src.style.sass)
		.pipe(sourcemaps.init())
		.pipe(sass()).on('error', swallowError)
		.pipe(prefix('last 5 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(sourcemaps.write('.', {
			includeContent: false,
			sourceRoot: '../../../src/scss'
		}))
		.pipe(gulp.dest(path.src.css))
		.pipe(gulp.dest(path.public.css))
		.pipe(browser.reload({stream: true}));
});
gulp.task('minify', () => {
	return gulp.src([path.src.style.css, path.public.style.css, '!'+path.src.style.css_min, '!'+path.public.style.css_min])
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest(path.src.css))
		.pipe(gulp.dest(path.public.css))
		.pipe(browser.reload({stream:true}));
});
gulp.task('js', () => {
	return gulp.src([path.src.js, '!'+path.src.js_min])
		.pipe(gulp.dest(path.public.js))
		.pipe(rename({suffix: '.min'}))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(path.public.js))
		.pipe(browser.reload({stream:true}));
});
gulp.task('js2', () => {
	return gulp.src(path.src.js_min)
		.pipe(gulp.dest(path.public.js))
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(path.public.js))
		.pipe(browser.reload({stream:true}));
});
gulp.task('images', () => {
	return gulp.src(path.src.img)
		.pipe(changed(path.public.img))
		.pipe(imagemin({progressive: true, optimizationLevel: 0, interlaced: true}))
		.pipe(gulp.dest(path.public.img));
});
gulp.task('imageanimate', () => {
	gulp.src('./src/images/**/*.animate.*')
		.pipe(changed('public/images'))
		.pipe(gulp.dest('public/images'));
});
gulp.task('fonts', () => {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.public.fonts));
});
gulp.task('video', () => {
	gulp.src('./src/video/**/*.*')
		.pipe(gulp.dest('public/video/'));
});

gulp.task('watch', () => {
	// Watch .html files
	gulp.watch(path.src.html, ['html', browser.reload]);
	gulp.watch(path.public.html).on('change', browser.reload);
	// Watch .sass files
	gulp.watch(path.src.style.sass, ['styles', browser.reload]);
	//gulp.watch('src/css/**/*.css.map', ['styles', browser.reload]);
	//gulp.watch('src/css/**/*.css', ['styles', browser.reload]);
	gulp.watch(path.src.style.css, ['minify', browser.reload]);
	// Watch .js files
	gulp.watch(path.src.js, ['js', browser.reload]);
	gulp.watch(path.src.js, ['js2', browser.reload]);
	// Watch image files
	gulp.watch('./src/images/**/*.*', ['images', browser.reload]);
	gulp.watch('./src/images/**/*.animate.*', ['imageanimate', browser.reload]);
	// Watch .fonts files
	gulp.watch(path.src.fonts, ['fonts', browser.reload]);
});
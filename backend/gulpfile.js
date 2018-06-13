var gulp = require('gulp'); 
var typedoc = require("gulp-typedoc");
var ts = require('gulp-typescript');

/**
 * Create TypeDoc
 */
gulp.task("typedoc", function() {
    return gulp
        .src(["src/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "ES2015",
            out: "docs/html/",
            name: "Solarcar Wetterdaten"
        }))
    ;
});

/**
 * Create TypeDoc Markdown
 */
gulp.task("typedoc-md", function() {
    return gulp
        .src(["src/*.ts"])
        .pipe(typedoc({
            module: "commonjs",
            target: "ES2015",
            out: "docs/md/",
            name: "Solarcar Wetterdaten",
            theme: "markdown"
        }))
    ;
});


/**
 * Compile TypeScript
 */
gulp.task('typescript', function() { 
    var project = ts.createProject('tsconfig.json'); 
  
    var result = gulp.src('./src/**/*.ts')
      .pipe(project());
  
    return result.js.pipe(gulp.dest("./dist"));
  });
  
  gulp.task('default', ['typescript', 'typedoc']);
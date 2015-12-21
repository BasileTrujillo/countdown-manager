/**
 * Created by basiletrujillo on 17/12/15.
 */
// Requis
var gulp = require('gulp');

// Include plugins
var plugins = require('gulp-load-plugins')(); // tous les plugins de package.json

// Variables de chemins
var srcJsPath  = './src'; // dossier src
var distJsPath = './dist'; // dossier dist

gulp.task('minify_js', function () {
    return gulp.src(srcJsPath + '/*.js')
        .pipe(plugins.plumber({ //Gestion d'erreur
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(plugins.uglify()) //Minification
        .pipe(plugins.rename({  //Rename en .min.js
            suffix: '.min'
        }))
        .pipe(gulp.dest(distJsPath + '/'));
});

// Tâche "build"
gulp.task('build', ['minify_js']);

// Tâche "watch" = je surveille *js
/* Uncoment to use
gulp.task('watch', function () {
    gulp.watch(srcJsPath + '/*.js', ['build']);
});
*/

// Tâche par défaut
gulp.task('default', ['build']);
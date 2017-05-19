module.exports = {
    files : ['app/**/*.css', 'app/**/*.js', 'images/**/*', 'app/**/*.html'],
    server : {
        baseDir: "app",
        routes: {
            "/lib": "lib",
            "/images": "images"
        }
    },
    notify: false
};

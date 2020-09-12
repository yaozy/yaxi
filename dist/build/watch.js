const Watcher = require('jiac/watcher');



new Watcher('./icon', './platforms/h5/icon')
    .sync()
    .watch();

new Watcher('./icon', './platforms/wx/icon')
    .plugin(/\.css$/i, file => file.replace(/\.css$/i, '.wxss'))
    .sync()
    .watch();



new Watcher('./images', './platforms/h5/images')
    .sync()
    .watch();

new Watcher('./images', './platforms/wx/images')
    .sync()
    .watch();



new Watcher('./src/js', './platforms/h5/js')
    .template(/\.html$/i)
    .sync()
    .watch();

new Watcher('./src/js', './platforms/wx/js')
    .template(/\.html$/i)
    .sync()
    .watch();

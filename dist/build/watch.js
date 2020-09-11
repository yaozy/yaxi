const Watcher = require('jiac/watcher');



new Watcher('./icon', './platforms/h5/icon')
    .syncDir()
    .watch();

new Watcher('./icon', './platforms/wx/icon')
    .syncDir()
    .watch();



new Watcher('./images', './platforms/h5/images')
    .syncDir()
    .watch();

new Watcher('./images', './platforms/wx/images')
    .syncDir()
    .watch();



new Watcher('./src', './platforms/h5/js')
    .template(/\.html$/i)
    .syncDir()
    .watch();

new Watcher('./src', './platforms/wx/js')
    .template(/\.html$/i)
    .syncDir()
    .watch();

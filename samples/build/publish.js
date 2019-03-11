const Compressor = require('jiac/js-compressor');


new Compressor()
    .module('samples', 'samples', [
        '(index|model|template).js',
        'template.html'
    ])
    .output('samples/dist/main.js')

    .compress()
    .output('samples/dist/main.min.js')
    

new Compressor()
    .load('samples/(thread|global-var).js')
    .module('samples', 'samples', 'thread-data.js')
    .output('samples/dist/thread.js')

const Compressor = require('jiac/js-compressor');


new Compressor()
    .module('samples', 'samples', [
        '(index|model|template).js',
        'template.html'
    ])
    .output('samples/dist/index.js')
    
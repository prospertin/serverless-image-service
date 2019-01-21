const fs = require('fs');
const sharp = require('sharp');
const request = require('request');

module.exports = function resize(url, format, width, height) {
    var options = {
        encoding: null,
        headers: {'user-agent': 'node.js'} // IMPORTANT  akamai is blocking all requests sent using non common user agents
        // (basically they check User-Agent header). It is a very simple protection to avoid scrappers.
    }

    let transform = sharp();

    if (format) {
        transform = transform.toFormat(format);
    }
    transform = transform.setEncoding()
    if (width || height) {
        transform = transform.resize(width, height, { withoutEnlargement: true });
    }
    console.log("URL: " + url);
    transform.on("error",function(err){
        console.log("STREAM ERROR")
        // How to throw error here?
    });

    return request.get(url, options).pipe(transform);

}

//  var resizer = sharp().resize( 300, 300 ).withoutEnlargement().max().toFile( 'public/img_thumbs/' + thumb_name, ( err, info ) =>
// {
//     console.log( err );
// });
//
// request( url ).pipe( resizer );



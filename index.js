const request = require('request');
const sharp = require('sharp');

// OLD WAY WITH HANDLER
exports.handler = (event, context, callback) => {

    let method = event.httpMethod;
    let url = event.queryStringParameters.url;
    let widthString = event.queryStringParameters.width;
    let heightString = event.queryStringParameters.height;
    let format = event.queryStringParameters.format;

    let width, height;
    if (widthString) {
        width = parseInt(widthString);
    }
    if (heightString) {
        height = parseInt(heightString);
    }

    //Check if at least height or width is specified else error

    console.log("SERVER  LESS URL: " + url);
    var requestSettings = {
        url: url,
        headers: {'user-agent': 'node.js'},
        method: 'GET',
        encoding: null
    };
   
    request(requestSettings, function(error, response, body) {
        sharp(body)
        .resize(width, height, { withoutEnlargement: true })
        .toBuffer()
        .then( data => {
            callback(null, {
                statusCode: 200,
                headers: { 'Content-Type': `image/${format || 'png'}` },
                body: data.toString('base64'),
                isBase64Encoded: true
            })
        });
    })
}

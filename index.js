const serverless = require('serverless-http');
const express = require('express')
const resize = require('./resize');
const app = express()
const request = require('request');
const sharp = require('sharp');

// NEW WAY WITH EXPRESS
// app.get('/image', function (req, res) {
//    const widthString = req.query.width;
//    const heightString = req.query.height;
//    const format = req.query.format;
//    var url = req.query.url;
   
//    // Parse to integer if possible
//    let width, height;
//    if (widthString) {
//        width = parseInt(widthString);
//    }
//    if (heightString) {
//        height = parseInt(heightString);
//    }

//    if (url === undefined) {
//        url = 'https://buffer.com/library/wp-content/uploads/2018/11/free-images-featured-1024x547.png'
//    }

//    resize(url, format, width, height).pipe(res);
// });

// module.exports.handler = serverless(app);
  
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

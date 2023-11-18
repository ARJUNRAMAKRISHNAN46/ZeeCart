const sharp = require('sharp');

let originalImage = '/public/assets/iphone13.png';
let outputImage = '/public/assets/cropped-image.jpg';

sharp(originalImage)
    .extract({ width: 1600, height: 600, left: 60, top: 40 })
    .toFile(outputImage)
    .then(function (newFileInfo) {
        console.log('Image cropped and saved');
    })
    .catch(function (err) {
        console.log('An error occurred', err);
    });

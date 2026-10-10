const sizeOf = require('image-size');
module.exports = {imageSize: (f) => {const d = sizeOf(f); return {w: d.width, h: d.height};}};

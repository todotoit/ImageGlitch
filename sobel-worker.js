importScripts('node_modules/sobel/sobel.js');

self.onmessage = function (event) {
  // Sobel constructor returns an Uint8ClampedArray with sobel data
  var sobelData = Sobel(event.data);

  self.postMessage(sobelData);
};
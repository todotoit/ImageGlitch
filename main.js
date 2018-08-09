import UISelection from "./ui-selection.js";

const path = "assets/src-3.jpg";
var img = new Image();
img.src = path;
img.onload = function () {
    draw(this);
};

var canvas = document.getElementById('my-canvas');

// init pixel sorting worker
var butter = new Worker('node_modules/butter.js/src/butter-worker.js');

// init selection tool
UISelection.setCallback(slices)

// draw base image
function draw(img) {
    let sort = 0;
    let sortLimit = 0
    var content = document.getElementById("content");
    var canvas = content.getContext("2d");
    canvas.drawImage(img, 0, 0, img.width, img.height);
}

// slice and offset image
function slices(x, y, w, h) {
    x = x.map(0, 620, 0, 2480);
    y = y.map(0, 877, 0, 3508);
    w = w.map(0, 620, 0, 2480);
    h = h.map(0, 877, 0, 3508);
    var content = document.getElementById("content");
    var canvas = content.getContext("2d");
    var verticalSlices = Math.round(h / 20);
    var maxHorizOffset = w/5;
    for (var i = 0; i < verticalSlices; i++) {
        if (Math.random() > .01) {
            var horizOffset = getRandom(-Math.abs(maxHorizOffset), maxHorizOffset);
            //canvas.drawImage(img, x, y, x + w, y + h, horizOffset, getRandom(i * verticalSlices / 1.25, i * verticalSlices), img.width, i * verticalSlices + verticalSlices);
            canvas.drawImage(img, 0, y + i * verticalSlices, img.width, i * verticalSlices + verticalSlices, horizOffset, y + getRandom(i * verticalSlices / 1.25, i * verticalSlices), img.width, i * verticalSlices + verticalSlices);
        }
    }
}

butter.addEventListener('message', function afterSort(e) {
    console.log("Worker done")
    canvas.putImageData(e.data.imageData, 0, 0);
    sort++
    if (sort <= sortLimit) pixelSort(e.data.imageData)
}, false);

function pixelSort(imageData) {
    butter.postMessage({
        imageData: imageData,
        width: getRandom(content.width / 2, content.width),
        height: getRandom(0, content.height),
        mode: 'bright',
        iterations: getRandom(0, 6),
        threshold: -10000000
    });
}

// sobel filter for edge detection
function sobelFilter(canvas)
{
    var imageData = canvas.getImageData(0, 0, content.width, content.height);
    var ww = new Worker('/sobel-worker.js');
    ww.postMessage(imageData);
    ww.onmessage = function (event) {
        var sobelData = event.data;
        var sobelImageData = Sobel.toImageData(sobelData, content.width, content.height);
        canvas.putImageData(sobelImageData, 0, 0);
    };
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const path = "assets/src-3.jpg";
var img = new Image();
img.src = path;
img.onload = function () {
    draw(this);
};

var canvas = document.getElementById('my-canvas');
var butter = new Worker('node_modules/butter.js/src/butter-worker.js');
var drawingSelection = false;
selStartX = 0
selStartY = 0

var selection = document.getElementById("selection")

document.onmousedown = function (e) {
    drawingSelection = true
    selStartX = e.pageX
    selStartY = e.pageY
    selection.className = "active"
    selection.style.left = selStartX
    selection.style.top = selStartY
    selection.style.width = 0
    selection.style.height = 0
}

document.onmousemove = function (e) {
    if (drawingSelection) {
        selection.style.width = e.pageX - selStartX
        selection.style.height = e.pageY - selStartY
    }
}

document.onmouseup = function (e) {
    drawingSelection = false
    selection.className = ""
    slices(selStartX, selStartY, e.pageX - selStartX, e.pageY - selStartY)
}


function draw(img) {
    let sort = 0;
    let sortLimit = 0
    var content = document.getElementById("content");
    var canvas = content.getContext("2d");
    canvas.drawImage(img, 0, 0, img.width, img.height);
}

function slices(x, y, w, h) {
    x = x.map(0, 620, 0, 2480);
    y = y.map(0, 877, 0, 3508);
    w = w.map(0, 620, 0, 2480);
    h = h.map(0, 877, 0, 3508);
    console.log(x, y, w, h)
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
    var imageData = canvas.getImageData(0, 0, content.width, content.height);
    var ww = new Worker('/sobel-worker.js');
    ww.postMessage(imageData);

    ww.onmessage = function (event) {
        var sobelData = event.data;

        // Sobel.toImageData() returns a new ImageData object
        var sobelImageData = Sobel.toImageData(sobelData, content.width, content.height);
        console.log()
        canvas.putImageData(sobelImageData, 0, 0);
    };
}

function sort() {
    //pixelSort(imageData)

    butter.addEventListener('message', function afterSort(e) {
        console.log("Worker done")
        canvas.putImageData(e.data.imageData, 0, 0);
        sort++
        if (sort <= sortLimit) pixelSort(e.data.imageData)
    }, false);

    console.log("Worker started")
}

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

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
(() => {
  'use strict'

  const content = document.getElementById("content");
  const canvas = content.getContext("2d");

  let numOfSlices = 5;
  let slicesDirection = 'horizontal'
  let backImage = {
    path: document.querySelector('img.back').getAttribute('src'),
    position: 'center',
    invert: false
  }
  let sourceImage = {
    path: document.querySelector('img.source').getAttribute('src'),
    position: 'center',
    invert: false
  }

  // dom events
  // front image
  document.querySelector('.front input[name="source"]').addEventListener('change', (e) => {
    var file = e.srcElement.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      document.querySelector('.front img.source').setAttribute('src', reader.result);
      sourceImage.path = reader.result;
    }
    reader.readAsDataURL(file);
  })
  document.forms['frontImgPosition'].elements.position.forEach((el) => {
    el.addEventListener('change', (e) => { sourceImage.position = e.srcElement.value })
  })
  document.querySelector('.front input[name="invert"]').addEventListener('change', (e) => {
    sourceImage.invert = e.srcElement.checked
  })
  // background image
  document.querySelector('.background input[name="source"]').addEventListener('change', (e) => {
    var file = e.srcElement.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
      document.querySelector('.background img.back').setAttribute('src', reader.result);
      backImage.path = reader.result;
    }
    reader.readAsDataURL(file);
  })
  document.forms['backImgPosition'].elements.position.forEach((el) => {
    el.addEventListener('change', (e) => { backImage.position = e.srcElement.value })
  })
  document.querySelector('.background input[name="invert"]').addEventListener('change', (e) => {
    backImage.invert = e.srcElement.checked
  })
  // general
  document.querySelector('input[name="slices"]').addEventListener('change', (e) => {
    numOfSlices = parseInt(e.srcElement.value)
  })
  document.forms['direction'].elements.direction.forEach((el) => {
    el.addEventListener('change', (e) => { slicesDirection = e.srcElement.value })
  })
  document.querySelector('button[name="clear"]').addEventListener('click', (e) => {
    clear()
  })
  // button action
  // front image
  document.querySelector('.front button[name="draw"]').addEventListener('click', (e) => {
    loadImg(sourceImage.path).then((img) => draw(img))
  })
  document.querySelector('.front button[name="slice"]').addEventListener('click', (e) => {
    loadImg(sourceImage.path).then((img) => slices(img, sourceImage.invert, slicesDirection))
  })
  document.querySelector('.front button[name="explode"]').addEventListener('click', (e) => {
    loadImg(sourceImage.path).then((img) => explode(img, sourceImage.invert, sourceImage.position))
  })
  // background image
  document.querySelector('.background button[name="draw"]').addEventListener('click', (e) => {
    loadImg(backImage.path).then((img) => draw(img))
  })
  document.querySelector('.background button[name="slice"]').addEventListener('click', (e) => {
    loadImg(backImage.path).then((img) => slices(img, backImage.invert, slicesDirection))
  })
  document.querySelector('.background button[name="explode"]').addEventListener('click', (e) => {
    loadImg(backImage.path).then((img) => explode(img, backImage.invert, backImage.position))
  })

  Number.prototype.map = (in_min, in_max, out_min, out_max) => {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const loadImg = (path) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = path;
      img.onload = () => resolve(img);
    })
  }

  // draw base image
  const draw = (img) => {
    canvas.drawImage(img, 0, 0, content.width, content.height);
  }

  const slicesExplode = (img, invert = false, position = 'center') => {
    let sliceSHeight = Math.round(img.height / numOfSlices);
    let sliceDHeight = Math.round(content.height / numOfSlices);
    let sy = 0
    let dy = 0

    switch (position) {
      case 'bottom':
        sy = img.height - sliceSHeight
        dy = invert? content.height - (sliceDHeight*2) : content.height - sliceDHeight
        for (let i = 0; i < numOfSlices; i++) {
          canvas.drawImage(img, 0, sy, img.width, sliceSHeight, 0, dy, content.width, sliceDHeight)
          sy -= (sliceSHeight)
          dy -= (sliceDHeight*2)
        }
        break;
      case 'top':
        sy = 0
        dy = invert? (sliceDHeight) : 0
        for (let i = 0; i < numOfSlices; i++) {
          canvas.drawImage(img, 0, sy, img.width, sliceSHeight, 0, dy, content.width, sliceDHeight)
          sy += (sliceSHeight)
          dy += (sliceDHeight*2)
        }
        break;
      case 'center':
        sy = invert? img.height/2 + (sliceSHeight/2) : img.height/2 - (sliceSHeight/2)
        dy = invert? content.height/2 + (sliceDHeight/2) : content.height/2 - (sliceDHeight/2)
        // top part
        for (let i = 0; i < numOfSlices/2; i++) {
          canvas.drawImage(img, 0, sy, img.width, sliceSHeight, 0, dy, content.width, sliceDHeight)
          sy -= (sliceSHeight)
          dy -= (sliceDHeight*2)
        }
        // reset
        sy = invert? img.height/2 + (sliceSHeight/2) : img.height/2 - (sliceSHeight/2)
        dy = invert? content.height/2 + (sliceDHeight/2) : content.height/2 - (sliceDHeight/2)
        // bottom part
        for (let i = 0; i < numOfSlices/2; i++) {
          canvas.drawImage(img, 0, sy, img.width, sliceSHeight, 0, dy, content.width, sliceDHeight)
          sy += (sliceSHeight)
          dy += (sliceDHeight*2)
        }
        break;
      default: return
    }
  }

  const slicesExplodeVertical = (img, invert = false, position = 'center') => {
    let sliceSWidth = Math.round(img.width / numOfSlices);
    let sliceDWidth = Math.round(content.width / numOfSlices);
    let sx = 0
    let dx = 0

    switch (position) {
      case 'bottom':
        sx = img.width - sliceSWidth
        dx = invert? content.width - (sliceDWidth*2) : content.width - sliceDWidth
        for (let i = 0; i < numOfSlices; i++) {
          canvas.drawImage(img, sx, 0, sliceSWidth, img.height, dx, 0, sliceDWidth, content.height)
          sx -= (sliceSWidth)
          dx -= (sliceDWidth*2)
        }
        break;
      case 'top':
        sx = 0
        dx = invert? (sliceDWidth) : 0
        for (let i = 0; i < numOfSlices; i++) {
          canvas.drawImage(img, sx, 0, sliceSWidth, img.height, dx, 0, sliceDWidth, content.height)
          sx += (sliceSWidth)
          dx += (sliceDWidth*2)
        }
        break;
      case 'center':
        sx = invert? img.width/2 + (sliceSWidth/2) : img.width/2 - (sliceSWidth/2)
        dx = invert? content.width/2 + (sliceDWidth/2) : content.width/2 - (sliceDWidth/2)
        // top part
        for (let i = 0; i < numOfSlices/2; i++) {
          canvas.drawImage(img, sx, 0, sliceSWidth, img.height, dx, 0, sliceDWidth, content.height)
          sx -= (sliceSWidth)
          dx -= (sliceDWidth*2)
        }
        // reset
        sx = invert? img.width/2 + (sliceSWidth/2) : img.width/2 - (sliceSWidth/2)
        dx = invert? content.width/2 + (sliceDWidth/2) : content.width/2 - (sliceDWidth/2)
        // bottom part
        for (let i = 0; i < numOfSlices/2; i++) {
          canvas.drawImage(img, sx, 0, sliceSWidth, img.height, dx, 0, sliceDWidth, content.height)
          sx += (sliceSWidth)
          dx += (sliceDWidth*2)
        }
        break;
      default: return
    }
  }

  const explode = (img, invert = false, position = 'center') => {
    return slicesDirection == 'horizontal'? slicesExplode(img, invert, position) : slicesExplodeVertical(img, invert, position)
  }

  const slices = (img, invert = false, direction = 'horizontal') => {
    let sliceSWidth = Math.round(img.width / numOfSlices);
    let sliceSHeight = Math.round(img.height / numOfSlices);
    let sliceDWidth = Math.round(content.width / numOfSlices);
    let sliceDHeight = Math.round(content.height / numOfSlices);
    let sx = invert? (sliceSHeight) : 0
    let dx = invert? (sliceDHeight) : 0
    let sy = invert? (sliceSWidth) : 0
    let dy = invert? (sliceDWidth) : 0
    // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    for (let i = 0; i < numOfSlices; i++) {
      if (direction == 'horizontal') {
        canvas.drawImage(img, 0, sx, img.width, sliceSHeight, 0, dx, content.width, sliceDHeight)
        sx += (sliceSHeight*2)
        dx += (sliceDHeight*2)
      } else if (direction == 'vertical') {
        canvas.drawImage(img, sy, 0, sliceSWidth, img.height, dy, 0, sliceDWidth, content.height)
        sy += (sliceSWidth*2)
        dy += (sliceDWidth*2)
      } else {
        return
      }
    }
  }

  const clear = () => {
    canvas.clearRect(0, 0, content.width, content.height)
  }

  const init = (async () => {
    await loadImg(backImage.path).then((img) => slicesExplodeVertical(img, false, 'center'))
    await loadImg(sourceImage.path).then((img) => slicesExplodeVertical(img, true, 'center'))
  })()
})()

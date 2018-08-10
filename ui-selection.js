class UISelection {

  constructor() {
    this.drawingSelection = false;
    this.selectionStartX = 0;
    this.selectionStartY = 0;
    this.callback = null;
    this.selection = null
  }

  set callback(cb) {
    this.callback = cb
  }
  set selectionStartX(val) {
    this.selectionStartX = val
  }
  set selectionStartY(val) {
    this.selectionStartY = val
  }

  static init() {
    let self = this
    self.selection = document.getElementById("selection");

    document.onmousedown = function (e) {
      self.drawingSelection = true
      self.selectionStartX = e.pageX
      self.selectionStartY = e.pageY
      self.selection.className = "active"
      self.selection.style.left = self.selectionStartX
      self.selection.style.top = self.selectionStartY
      self.selection.style.width = 0
      self.selection.style.height = 0
    }
    document.onmousemove = function (e) {
      if (self.drawingSelection) {
        self.selection.style.width = e.pageX - self.selectionStartX
        self.selection.style.height = e.pageY - self.selectionStartY
      }
    }
    document.onmouseup = function (e) {
      self.drawingSelection = false
      self.selection.className = ""
      self.callback(self.selectionStartX, self.selectionStartY, e.pageX - self.selectionStartX, e.pageY - self.selectionStartY)
    }
  }
}

export default UISelection;

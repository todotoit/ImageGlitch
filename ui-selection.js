export default class UISelection {
  constructor() {
    this.drawingSelection = false;
    this.selectionStartX = 0;
    this.selectionStartY = 0;
    this.callback = null;
    this.selection = document.getElementById("selection");
    document.onmousedown = function (e) {
      this.drawingSelection = true
      this.selectionStartX = e.pageX
      this.selectionStartY = e.pageY
      this.selection.className = "active"
      this.selection.style.left = selectionStartX
      this.selection.style.top = selectionStartY
      this.selection.style.width = 0
      this.selection.style.height = 0
    }

    document.onmousemove = function (e) {
      if (this.drawingSelection) {
        this.selection.style.width = e.pageX - selectionStartX
        this.selection.style.height = e.pageY - selectionStartY
      }
    }

    document.onmouseup = function (e) {
      this.drawingSelection = false
      this.selection.className = ""
      this.callback(selectionStartX, selectionStartY, e.pageX - selectionStartX, e.pageY - selectionStartY)
    }
  }

  setCallback(cb) {
    callback = cb
  }
}
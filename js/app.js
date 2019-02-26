// @ts-check

const app = {
  initDone: false,

  mode: "line",
  modes: ["line", "select", "pencil", "move"],
  layers: [],
  selectedLayer: null,
  pos: null,

  init: function() {
    if (this.initDone) {
      return;
    }
    this.bindToolbarEvents();
    this.bindDrawAreaEvents();
    this.initDone = true;
  },

  bindToolbarEvents: function() {
    this.modes.forEach(mode => {
      document.getElementById(`btn-${mode}`).addEventListener("click", () => {
        this.mode = mode;
        this.pos = null;
        this.selectedLayer = null;
        this.updateToolbarState();
        this.render();
      });
    });

    // You aren't ever really in "erase mode" though that would be a cool feature
    document.getElementById("btn-erase").addEventListener("click", () => {
      if (this.selectedLayer !== null) {
        this.removeLayer(this.selectedLayer);
        this.selectedLayer = null;
        this.render();
      }
    });
  },

  updateToolbarState: function() {
    this.modes.forEach(mode => {
      const isActive = mode === this.mode;
      document.getElementById(`btn-${mode}`).className = isActive
        ? "active"
        : "";
    });
  },

  bindDrawAreaEvents: function() {
    const canvas = this.getCanvas();

    const handleByMode = e => {
      switch (this.mode) {
        case "line":
          if (e.type !== "mousedown") return;
          this.handleLineDrawing(e);
          break;
        case "select":
          if (e.type !== "mousedown") return;
          const closestIndex = this.getClosestLayer(e.offsetX, e.offsetY);
          this.selectedLayer = closestIndex;
          this.render();
          break;
        case "pencil":
          this.drawHandler(e);
          break;
        case "move":
          this.dragHandler(e, { width: canvas.width, height: canvas.height });
          break;
        default:
          break;
      }
    };

    canvas.addEventListener("mousedown", handleByMode, false);
    canvas.addEventListener("mousemove", handleByMode, false);
    canvas.addEventListener("mouseup", handleByMode, false);
    canvas.addEventListener("mouseout", handleByMode, false);
  },

  handleLineDrawing: function(e) {
    const { offsetX: x, offsetY: y } = e;

    if (!this.pos) {
      // save first click of the line
      this.pos = [x, y];
    } else {
      // create the line and add to the list
      const x0 = this.pos[0];
      const y0 = this.pos[1];
      const length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
      const line = new Line(x0, y0, x, y, length);
      this.layers.push(line);
      this.pos = null;
      this.render();
    }
  },

  isDragging: false,
  dragHandler: function(e, canvasDimensions) {
    const { offsetX: x, offsetY: y } = e;

    switch (e.type) {
      case "mousedown":
        this.isDragging = true;
        const closestIndex = this.getClosestLayer(x, y);
        this.selectedLayer = closestIndex;
        break;

      case "mousemove":
        if (this.selectedLayer !== null && this.isDragging) {
          const layer = this.layers[this.selectedLayer];
          layer.move(e.movementX, e.movementY, canvasDimensions);
          this.render();
        }
        break;

      case "mouseup":
      case "mouseout":
        this.selectedLayer = null;
        this.isDragging = false;
        this.render();
        break;
      default:
        break;
    }
  },

  // Pencil drawing functionality
  isDrawing: false,
  drawing: [],
  drawHandler: function(e) {
    const ctx = this.getCtx();
    const { offsetX: x, offsetY: y } = e;

    switch (e.type) {
      case "mousedown":
        this.isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
        this.drawing.push([x, y]);
        break;
      case "mousemove":
        if (!this.isDrawing) return;
        ctx.lineTo(x, y);
        ctx.stroke();
        this.drawing.push([x, y]);
        break;
      case "mouseup":
        if (!this.isDrawing) return;
        ctx.lineTo(x, y);
        ctx.stroke();
        this.drawing.push([x, y]);
        this.isDrawing = false;
        this.layers.push(new Path(this.drawing));
        this.drawing = [];
        break;
      case "mouseout":
        this.isDrawing = false;
        this.layers.push(new Path(this.drawing));
        this.drawing = [];
        break;

      default:
        break;
    }
  },

  getClosestLayer: function(x, y) {
    if (this.layers.length === 0) return;

    let minSquareDistance = 10;
    let closestIndex = null;

    this.layers.forEach((layer, index) => {
      const squareDistance = layer.squareDistanceFrom(x, y);
      if (squareDistance < minSquareDistance) {
        minSquareDistance = squareDistance;
        closestIndex = index;
      }
    });

    return closestIndex;
  },

  /** @param {number} i */
  removeLayer: function(i) {
    this.layers.splice(i, 1);
  },

  getCanvas: function() {
    return document.getElementById("canvas");
  },

  getCtx: function() {
    return this.getCanvas().getContext("2d");
  },

  render: function() {
    const ctx = this.getCtx();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.layers.forEach((layer, i) => {
      layer.draw(ctx);
      if (this.selectedLayer !== null && i === this.selectedLayer) {
        layer.drawEnds(ctx);
      }
    });
  }
};

// @ts-check

const app = {
  initDone: false,
  mode: "line",

  modes: ["line", "select", "pencil", "move"],
  lines: [],
  /** @type {null|number} */
  selectedLine: null,
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
        this.updateToolbarState();
      });
    });

    document.getElementById("btn-erase").addEventListener("click", () => {
      if (this.selectedLine !== null) {
        this.removeLine(this.selectedLine);
        this.selectedLine = null;
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
    const canvas = document.getElementById("canvas");
    canvas.addEventListener("click", e => {
      const x = e.offsetX;
      const y = e.offsetY;

      switch (this.mode) {
        case "line":
          if (!this.pos) {
            // save first click of the line
            this.pos = [x, y];
          } else {
            // create the line and add to the list
            const x0 = this.pos[0],
              y0 = this.pos[1];
            const length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
            const line = new Line(x0, y0, x, y, length);
            this.lines.push(line);
            this.pos = null;
          }
          break;

        case "select":
          if (this.lines.length > 0) {
            let minSquareDistance;
            let closestIndex;

            this.lines.forEach((line, index) => {
              const squareDistance = line.squareDistanceFrom(x, y);
              if (index === 0 || squareDistance < minSquareDistance) {
                minSquareDistance = squareDistance;
                closestIndex = index;
              }
            });

            console.log(closestIndex);
            this.selectedLine = closestIndex;
          }
          console.log("not implemented");
          break;
        case "pencil":
          console.log("not implemented");
          break;
        case "move":
          console.log("not implemented");
          break;
        default:
          break;
      }

      this.render();
    });
  },

  removeLine: function(i) {
    this.lines.splice(i, 1);
  },

  render: function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.lines.forEach((line, i) => {
      line.draw(ctx);
      if (this.selectedLine !== null && i === this.selectedLine) {
        line.drawEnds(ctx);
      }
    });
  }
};

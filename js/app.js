const app = {
  initDone: false,
  isEraseMode: false,
  lines: [],
  pos: null,
  
  init: function() {
    if(this.initDone) {
      return;
    }
    this.bindToolbarEvents();
    this.bindDrawAreaEvents();
    this.initDone = true;
  },
  
  bindToolbarEvents: function() {
    document.getElementById('btn-erase').addEventListener('click', () => {
      this.isEraseMode = true;
      this.pos = null;
      this.updateToolbarState();
    });
    document.getElementById('btn-line').addEventListener('click', () => {
      this.isEraseMode = false;
      this.pos = null;
      this.updateToolbarState();
    });
  },
  
  updateToolbarState: function() {
    document.getElementById('btn-erase').className = this.isEraseMode ? 'active' : '';
    document.getElementById('btn-line').className = this.isEraseMode ? '' : 'active';
  },
  
  bindDrawAreaEvents: function() {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('click', (e) => {
      const x = e.offsetX;
      const y = e.offsetY;
      if(this.isEraseMode) {
        if (this.lines.length > 0) {
          let minSquareDistance;
          let closestIndex;
          this.lines.forEach((line, index) => {
            const squareDistance = line.squareDistanceFrom(x, y);
            if(index === 0 || squareDistance < minSquareDistance) {
              minSquareDistance = squareDistance;
              closestIndex = index;
            }
          });
          this.lines.splice(closestIndex, 1);
        }
      } else {
        if(!this.pos) {
          // save first click of the line
          this.pos = [ x, y ];
        } else {
          // create the line and add to the list
          const x0 = this.pos[0], y0 = this.pos[1];
          const length = Math.sqrt((x - x0) * (x - x0) + (y - y0) * (y - y0));
          const line = new Line(x0, y0, x, y, length);
          this.lines.push(line);
          this.pos = null;
        }
      }
      this.render();
    });
  },
  
  render: function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.lines.forEach((line) => line.draw(ctx));
  },
};

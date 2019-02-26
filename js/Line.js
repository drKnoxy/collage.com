const Line = function(x1, y1, x2, y2, length) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.length = Geometry.squareDistance(x1, y1, x2, y2);
};

Line.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(this.x1, this.y1);
  ctx.lineTo(this.x2, this.y2);
  ctx.stroke();
};

Line.prototype.drawEnds = function(ctx) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  const drawEnd = (x, y) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);
    ctx.stroke();
  };
  drawEnd(this.x1, this.y1);
  drawEnd(this.x2, this.y2);
};

Line.prototype.move = function(dx, dy, canvasDimensions) {
  if (
    isYCollision(this.y1) ||
    isYCollision(this.y2) ||
    isXCollision(this.x1) ||
    isXCollision(this.x2)
  ) {
    return;
  }

  this.x1 += dx;
  this.y1 += dy;
  this.x2 += dx;
  this.y2 += dy;

  function isYCollision(y) {
    return y + dy > canvasDimensions.height || y + dy < 0;
  }
  function isXCollision(x) {
    return x + dx > canvasDimensions.width || x + dx < 0;
  }
};

Line.prototype.squareDistanceFrom = function(x, y) {
  const { x1, y1, x2, y2 } = this;
  return Geometry.squareDistanceToSegment(x, y, x1, y1, x2, y2);
};

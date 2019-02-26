const Path = function(points) {
  this.points = points;
};

Path.prototype.draw = function(ctx) {
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.beginPath();

  this.points.map(([x, y], i) => {
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
};

Path.prototype.drawEnds = function(ctx) {
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  const drawEnd = (x, y) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);
    ctx.stroke();
  };
  drawEnd(...this.points[0]);
  drawEnd(...this.points[this.points.length - 1]);
};

Path.prototype.squareDistanceFrom = function(x, y) {
  return this.points.reduce((minDistance, secondPoint, i) => {
    // Omit the first point, we are trying to compare to a line
    if (i === 0) return minDistance;

    const firstPoint = this.points[i - 1];
    const distanceFromSegment = Geometry.squareDistanceToSegment(
      x,
      y,
      firstPoint[0],
      firstPoint[1],
      secondPoint[0],
      secondPoint[1]
    );

    // Return the lesser
    return minDistance < distanceFromSegment
      ? minDistance
      : distanceFromSegment;
  }, Infinity);
};

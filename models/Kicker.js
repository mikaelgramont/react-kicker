const KickerModel = function(config) {
  this.config = config;
};

KickerModel.prototype.calculateRadius = function(h, alphaDeg) {
  var alphaRad = alphaDeg * Math.PI / 180,
    r = h / (1 - Math.cos(alphaRad));
  return r;
}

KickerModel.prototype.calculateLength = function(h, alphaDeg) {
  var alphaRad = alphaDeg * Math.PI / 180,
    l = h * Math.sin(alphaRad) / (1 - Math.cos(alphaRad)) + this.config.model3d.sides.extraLength;
  return l;
}

KickerModel.prototype.calculateArc = function(radius, alphaDeg) {
  var arc = radius * alphaDeg * Math.PI / 180;
  return arc;
}

KickerModel.prototype.create3dObject = function(imageList, renderer) {
  var sidePoints = this.calculateSidePoints_(this.angle, this.radius, config);
  var surfacePoints = this.calculateSurfacePoints_(this.angle, this.radius);

  this.representation3d = new Representation3D(this.data, sidePoints, surfacePoints, this.length, this.angle, this.arc, this.radius, this.width, this.height, imageList, config, renderer);
  return this.representation3d;
};

KickerModel.prototype.calculateSidePoints_ = function(angle, radius, config) {
  var minY = config.model3d.sides.minHeight;
  var minX = Math.acos(1 - minY / this.radius);

  var points = this.calculatePoints_(minX, minY, angle, radius, config);
  var lastPoint = points[points.length - 1];
  var extraLength = config.model3d.sides.extraLength;

  // Extend the sides a bit so we have room for a strut at the top
  points.push([lastPoint[0] + extraLength, lastPoint[1]]);
  points.push([lastPoint[0] + extraLength, 0]);

  points.unshift([points[0][0], 0]);

  return points;
};

KickerModel.prototype.calculateSurfacePoints_ = function(angle, radius) {
  const {thickness} = this.config.model3d.surface;

  var points = this.calculatePoints_(0, 0, angle, radius);
  var steps = points.length;
  var angleRad = angle * Math.PI / 180;

  for (l = points.length - 1, i = l; i >= 0; i--) {
    var currentAngleRad = i / steps * angleRad;
    x = points[i][0] - thickness * Math.sin(currentAngleRad);
    y = points[i][1] + thickness * Math.cos(currentAngleRad);

    points.push([x, y]);
  }

  return points;
};

KickerModel.prototype.calculatePoints_ = function(minX, minY, angle, radius) {
  var angleRad = angle * Math.PI / 180;
  var steps = this.config.model3d.sides.steps;
  var currentAngleRad, x, y;

  var points = [];
  for (var i = 0; i <= steps; i++) {
    currentAngleRad = i / steps * angleRad;
    x = radius * Math.sin(currentAngleRad);
    y = radius * (1 - Math.cos(currentAngleRad));
    if (y < minY) {
      continue;
    }
    points.push([x, y]);
  }

  return points;
};

KickerModel.prototype.getRepresentation3d = function() {
  return this.representation3d;
}

export default KickerModel;
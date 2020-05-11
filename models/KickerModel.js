import config from '../config';

const KickerModel = function() {
};

KickerModel.prototype.calculateRadius = function(h, alphaDeg) {
  const alphaRad = alphaDeg * Math.PI / 180,
    r = h / (1 - Math.cos(alphaRad));
  return r;
}

KickerModel.prototype.calculateLength = function(h, alphaDeg) {
  const alphaRad = alphaDeg * Math.PI / 180,
    l = h * Math.sin(alphaRad) / (1 - Math.cos(alphaRad)) + config.model3d.sides.extraLength;
  return l;
}

KickerModel.prototype.calculateArc = function(radius, alphaDeg) {
  const arc = radius * alphaDeg * Math.PI / 180;
  return arc;
}

KickerModel.prototype.create3dObject = function(imageList, renderer) {
  const sidePoints = this.calculateSidePoints_(this.angle, this.radius);
  const surfacePoints = this.calculateSurfacePoints_(this.angle, this.radius);

  this.representation3d = new Representation3d(this.data, sidePoints, surfacePoints, this.length, this.angle, this.arc, this.radius, this.width, this.height, imageList, config, renderer);
  return this.representation3d;
};


KickerModel.prototype.getRepresentation3d = function() {
  return this.representation3d;
}

export default KickerModel;
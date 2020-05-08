"use strict";
/* exported GameObject */
class GameObject extends UniformProvider {
  constructor(mesh) {
    super("gameObject");

    this.position = new Vec3(0, 0, 0);
    this.roll = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.scale = new Vec3(1, 1, 1);

    this.parent = null;

    this.move = function(){};
    this.control = function(){};
    this.force = new Vec3();
    this.torque = 0;
    this.velocity = new Vec3();
    this.invMass = 1;
    this.backDrag = 1;
    this.sideDrag = 1;
    this.invAngularMass = 1;
    this.angularVelocity = 0;
    this.angularDrag = 1;

    this.boundingRadius = 0.5;

    this.modelMatrix = new Mat4();
    this.modelMatrixInverse = new Mat4();
    // this.interact = function();

    this.addComponentsAndGatherUniforms(mesh); // defines this.modelMatrix
  }

  update() {
  	this.modelMatrix.set().
  		scale(this.scale).
  		rotate(this.roll).
        rotate(this.pitch, 1, 0, 0).
        rotate(this.yaw, 0, 1, 0).
  		translate(this.position);

  	if (this.parent) {
      this.parent.update();
      this.modelMatrix.mul(this.parent.modelMatrix);
    }
  }
}

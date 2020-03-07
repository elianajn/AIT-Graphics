"use strict"; 
/* exported GameObject */
class GameObject extends UniformProvider {
  constructor(mesh) { 
    super("gameObject");

    this.position = new Vec3(0, 0, 0); 
    this.orientation = 0; 
    this.scale = new Vec3(1, 1, 1); 

    this.addComponentsAndGatherUniforms(mesh); // defines this.modelMatrix
  }

  update(){
  	this.modelMatrix.set();
  	this.modelMatrix.scale(this.scale);
  	this.modelMatrix.rotate(this.orientation);
  	this.modelMatrix.translate(this.position);
  }

  //PRACTICAL TODO: update method setting up this.modelMatrix
}
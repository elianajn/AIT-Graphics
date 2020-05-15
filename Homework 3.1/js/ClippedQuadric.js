class ClippedQuadric extends UniformProvider {
    constructor(id, ...programs) {
      super(`clippedQuadrics[${id}]`);
      this.addComponentsAndGatherUniforms(...programs);
      this.surface = new Mat4();
      this.clipper = new Mat4();
    }
    makeUnitCylinder(){
      this.surface.set(1,  0,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  1,  0,
                       0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                       0,  1,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0, -1);
    }
    makeUnitSphere(){
    this.surface.set(1,  0,  0,  0,
                     0,  1,  0,  0,
                     0,  0,  1,  0,
                     0,  0,  0,  -1);
    this.clipper.set(0,  0,  0,  0,
                     0,  0,  0,  0,
                     0,  0,  0,  0,
                     0,  0,  0,  0);
    }
    makeUnitCone(){
    this.surface.set(1,  0,  0,  0,
                     0,  -1,  0,  0,
                     0,  0,  1,  0,
                     0,  0,  0,  0);
    this.clipper.set(0,  0,  0,  0,
                     0,  1,  0,  0,
                     0,  0,  0,  0,
                     0,  0,  0,  -1);
    }
    transform(M){
      let invM = new Mat4(M).invert();
      let transposedM = new Mat4(M).transpose();
      this.surface = this.surface.premul(invM).mul(transposedM);
      this.clipper = this.clipper.premul(invM).mul(transposedM);
    }
}

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
    makeCone(){
    this.surface.set(1,  0,  0,  0,
                     0,  -1/4,  0,  0,
                     0,  0,  1,  0,
                     0,  0,  0,  0);
    this.clipper.set(1,  0,  0,  0,
                     0,  1,  0,  6,
                     0,  0,  1,  0,
                     0,  0,  0,  0);
    }
    makeCrown(){
      this.surface.set(1,  0,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  1,  0,
                       0,  -1,  0,  0);
      this.clipper.set(0,  0,  0,  0,
                       0,  1,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0,  -1);
    }
    transform(M){
      M.invert();
        this.surface.premul(M);
        this.clipper.premul(M);
        M.transpose();
        this.surface.mul(M);
        this.clipper.mul(M);
    }
}

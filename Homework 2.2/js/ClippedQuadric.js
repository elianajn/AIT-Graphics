class ClippedQuadric extends UniformProvider {
    constructor(id, ...programs) {
      super(`clippedQuadrics[${id}]`);
      this.addComponentsAndGatherUniforms(...programs);
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
}

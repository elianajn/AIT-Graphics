class Light extends UniformProvider {
    constructor(id, ...programs) {
      super(`lights[${id}]`);
      this.position = new Vec4();  // should be added
      this.powerDensity = new Vec3(); // by reflection

      this.addComponentsAndGatherUniforms(...programs);
    }
}

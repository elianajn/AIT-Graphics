"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];
    this.gameObjects = [];

    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");
    this.programs.push(
    	this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));

    this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad-vs.glsl");
    this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace-fs.glsl");
    this.fsShow = new Shader(gl, gl.FRAGMENT_SHADER, "show-fs.glsl");
    this.programs.push(
      this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace));
    this.programs.push(
      this.showProgram = new TexturedProgram(gl, this.vsQuad, this.fsShow));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.traceMaterial = new Material(this.traceProgram);



    this.envTexture = new TextureCube(gl, [
    "media/posx512.jpg",
    "media/negx512.jpg",
    "media/posy512.jpg",
    "media/negy512.jpg",
    "media/posz512.jpg",
    "media/negz512.jpg",]
    );


    this.traceMaterial.envTexture.set(this.envTexture);
    this.traceMaterial.specularColor = new Vec3(1.0, 1.0, 1.0);
    this.traceMaterial.shininess = 10.0;
    this.traceMaterial.freq = 10;
    this.traceMaterial.noiseFreq = 25;
    this.traceMaterial.noiseExp = 3;
    this.traceMaterial.noiseAmp = 20;
    this.traceMaterial.lightWoodColor = new Vec3(0.996, 0.89, 0.733);//rgb(99.6%,89%,73.3%)
    this.traceMaterial.darkWoodColor = new Vec3(0.714, 0.455, 0.184);//rgb(182,116,47);rgb(71.4%,45.5%,18.4%)//new Vec3(2.54,2.27,1.87);
    // this.traceMaterial.darkWoodColor = new Vec3(1.0,0.0,1.0);
    // rgb(182,116,47)
    // this.traceMaterial.colorTexture.set(new Texture2D(gl, "media/posy512.png"));
    // this.traceMaterial.colorTexture.set(new Texture2D(gl, "media/pattern.jpg"));
    this.traceMaterial.materialColor = new Vec3(1.0, 0.0, 0.0);
    this.traceMesh = new Mesh(this.traceMaterial, this.texturedQuadGeometry);

    this.traceQuad = new GameObject(this.traceMesh);
    this.gameObjects.push(this.traceQuad);

    // this.slowpokeMaterial = new Material(this.texturedProgram);
    // this.slowpokeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"));
    // this.eyeMaterial = new Material(this.texturedProgram);
    // this.eyeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));
    // this.mesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json",
    //     [this.slowpokeMaterial, this.eyeMaterial]);

    // this.avatar =  new GameObject(this.mesh);
    //this.gameObjects.push(this.avatar);


    this.clippedQuadrics = [];
    this.clippedQuadrics.push(new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    this.clippedQuadrics.push(new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    this.clippedQuadrics.push(new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    this.clippedQuadrics.push(new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    this.clippedQuadrics[0].makeUnitCylinder();
    this.clippedQuadrics[1].makeCrown();
    // this.clippedQuadrics[0].makeUnitSphere();
    // this.clippedQuadrics[1].makePawn();
    this.clippedQuadrics[2].makeCone();
    this.clippedQuadrics[3].makeUnitSphere();
    // this.clippedQuadrics[0].makeUnitCone();
    this.clippedQuadrics[0].transform(new Mat4().set().scale(0.7, 1.5, 0.7).translate(new Vec3(1.5, 1.8, 1.0)));
    this.clippedQuadrics[1].transform(new Mat4().set().scale(0.7, 1.0, 0.7).translate(new Vec3(1.5, 3.0, 1.0)));
    this.clippedQuadrics[2].transform(new Mat4().set().scale(0.5, 0.5, 0.5));
    this.clippedQuadrics[3].transform(new Mat4().set().scale(0.5, 0.5, 0.5));

    this.lights = [];
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights[0].position.set(1, 1, 1, 0).normalize();
    this.lights[0].powerDensity.set(1, 1, 1);
    this.lights[1].position.set(-5, 5, -2, 1).normalize();
    this.lights[1].powerDensity.set(1, 0, 0);


    this.camera = new PerspectiveCamera(...this.programs);
    this.camera.position.set(0, 5, 25);
    this.camera.update();
    this.addComponentsAndGatherUniforms(...this.programs);


    gl.enable(gl.DEPTH_TEST);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;
    //this.time.set(t);
    this.time = t;

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.move(dt, keysPressed);

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
        gameObject.draw(this, this.camera, ...this.lights, ...this.clippedQuadrics);
    }
  }
}

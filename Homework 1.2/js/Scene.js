"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.triangleGeometry = new TriangleGeometry(gl);
    this.quadGeometry = new QuadGeometry(gl);
    // TODO: create more geometries

    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.fsStriped = new Shader(gl, gl.FRAGMENT_SHADER, "striped-fs.glsl");
    // TODO: create more shaders

    this.programs = [];
    this.programs.push( this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid));
    this.programs.push( this.stripedProgram = new Program(gl, this.vsIdle, this.fsStriped));
    // TODO: create more programs

    // PRACTICAL TODO: create materials, set properties reflecting uniforms
    this.stripedMaterial = new Material(this.stripedProgram);
    this.stripedMaterial.solidColor.set(0.1, 0.4, 0.5);
    this.stripedMaterial.stripeWidth = 0.1;


    // PRACTICAL TODO: create meshes combining materials and geometries
    this.stripedMaterial.solidColor.set(0.0,0.0, 0.0);
    this.stripedMaterial.stripeWidth = 0.05;
    this.mesh = new Mesh(this.stripedMaterial, this.quadGeometry);

    // PRACTICAL TODO: create game objects
    this.gameObjects = [];
    // this.gameObjects.push(new GameObject(this.mesh));
    this.gameObjects.push(new GameObject(new Mesh(this.stripedMaterial,this.triangleGeometry)));
    this.gameObjects.push(new GameObject(this.mesh));

    this.camera = new OrthoCamera(...this.programs);

    this.addComponentsAndGatherUniforms(...this.programs);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.clientWidth /canvas.clientHeight );

  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;
    this.gameObject = this.gameObjects[0];
    // var gameObect = gameObjects[0];
    if(keysPressed.LEFT){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
        // this.camera.viewProjMatrix.translate(-0.05,0,0);
        // this.gameObjects[0].modelMatrix = (-0.05,0,0);
        this.gameObject.position.x -= 0.5*dt;
        // this.gameObject.update();
    }
    if(keysPressed.RIGHT){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
        this.gameObject.position.x += 0.5*dt;
    }
    if(keysPressed.UP){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
        this.gameObject.position.y += 0.5*dt;
    }
    if(keysPressed.DOWN){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
        this.gameObject.position.y -= 0.5*dt;
    }
    if(keysPressed.K){
        this.camera.viewProjMatrix.translate(-0.05,0,0);
    }
    if(keysPressed.L){
        this.camera.viewProjMatrix.translate(0.05,0,0);
    }
    if(keysPressed.I){
        this.camera.viewProjMatrix.translate(0,0.05,0);
    }
    if(keysPressed.J){
        this.camera.viewProjMatrix.translate(0,-0.05,0);
    }
    if(keysPressed.Z){ //zoom in
        this.camera.viewProjMatrix.scale(1.01);
    }
    if(keysPressed.X){ //zoom out
        this.camera.viewProjMatrix.scale(0.9);
    }


    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // PRACTICAL TODO: simplify code using Material
    // gl.useProgram(this.stripedProgram.glProgram);
    // new Mat4(
    //     0.5, 0.0, 0.0, 0.0,
    //     0.0, 0.5, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    //     ).commit(
    //     gl,
    //     gl.getUniformLocation(this.stripedProgram.glProgram, "gameObject.modelMatrix")
    //     );
    // new Vec4(1, 1, 1, 1).commit(
    //     gl,
    //     gl.getUniformLocation(this.stripedProgram.glProgram, "material.solidColor")
    //     );
    // new Vec1(0.1).commit(
    //     gl,
    //     gl.getUniformLocation(this.stripedProgram.glProgram, "material.stripeWidth")
    //     );

    // this.quadGeometry.draw();

    // this.material.draw();
    // this.triangleGeometry.draw();
    // PRACTICAL TODO: simplify code using Mesh
    // this.mesh.draw();

    // PRACTICAL TODO: get rid of custom drawing above, use only game objects
    // // PRACTICAL TODO: update all game objects
    // for(var i = 0; i < this.gameObjects.length; i++){
    //     this.gameObjects[i].update();
    // }
    // for(var i = 0; i < this.gameObjects.length; i++){
    //     this.gameObjects[i].draw();
    // }
    for(const gameObject of this.gameObjects){
        gameObject.update();
    }
    for(const gameObject of this.gameObjects){
        gameObject.draw(this.camera);
    }
    // PRACTICAL TODO: draw all game objects

  }
}

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
    this.selectionMaterial = new Material(this.solidProgram);
    this.selectionMaterial.solidColor.set(1.0,0,0);
    // this.selectionMeshTriganl = new Mesh(this.selectionMaterial, )


    this.stripedMaterialBlue = new Material(this.stripedProgram);
    this.stripedMaterialBlue.solidColor.set(0.1, 0.4, 0.5);
    this.stripedMaterialBlue.stripeWidth = 0.1;

    this.stripedMaterialYellow = new Material(this.stripedProgram);
    this.stripedMaterialYellow.solidColor.set(0.0, 0.5, 0.5);
    this.stripedMaterialYellow.stripeWidth = 0.2;

    // PRACTICAL TODO: create meshes combining materials and geometries

    // PRACTICAL TODO: create game objects
    this.gameObjects = [];
    // this.gameObjects.push(new GameObject(this.mesh));
    this.gameObjects.push(new GameObject(new Mesh(this.stripedMaterialBlue,this.triangleGeometry)));
    this.gameObject1 = new GameObject(new Mesh(this.stripedMaterialYellow,this.quadGeometry))
    this.gameObject1.scale = (0.2, 0.2, 0.2);
    this.gameObject1.position.x = -0.9;
    this.gameObject1.position.y = 0.7;
    // this.gameObject1.position.y += 2.0;
    this.gameObjects.push(this.gameObject1);

    this.index = 0;
    this.square = false;
    this.mouseClick = [0,0];
    this.clickForNew = false;

    this.camera = new OrthoCamera(...this.programs);
    this.camera.update();

    this.addComponentsAndGatherUniforms(...this.programs);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.clientWidth /canvas.clientHeight );

  }

  subtract_array(arr1, arr2){
    var difference = [];
    if(arr1.length != arr2.length){
      console.log("could not subtract arrays: length not equal");
    }
    else {
      {
        for(let i = 0; i < arr1.length; i++)
        {
          difference[i] = arr1[i] - arr2[i];
        }
      }
    }
    return difference;
  }

  update(gl, keysPressed, mouseClick) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0;
    this.timeAtLastFrame = timeAtThisFrame;
    this.gameObject = this.gameObjects[this.index];
    // var gameObect = gameObjects[0];
    if(keysPressed.W){
      keysPressed.W = false;
      // console.log(dt);
      if(this.index < this.gameObjects.length-1){
        this.index++;
      }
      else{
        this.index = 0;
      }
      this.gameObject = this.gameObjects[this.index];
    }
    if(keysPressed.LEFT){
        // PRACTICAL TODO: move/rotate/accelerate avatar game object
        this.gameObject.position.x -= 0.5*dt;
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
        // this.camera.viewProjMatrix.translate(0,-0.05,0);
        this.camera.position.y += 0.01;
        this.camera.update();
    }
    if(keysPressed.L){
        // this.camera.viewProjMatrix.translate(0.05,0,0);
        this.camera.position.x -= 0.01;
        this.camera.update();
    }
    if(keysPressed.I){
        // this.camera.viewProjMatrix.translate(0,0.05,0);
        this.camera.position.y -= 0.01;
        this.camera.update();
    }
    if(keysPressed.J){
        // this.camera.viewProjMatrix.translate(-0.05,0,0);
        this.camera.position.x += 0.01;
        this.camera.update();

    }
    if(keysPressed.Z){ //zoom in
        this.camera.viewProjMatrix.scale(1.01);
    }
    if(keysPressed.X){ //zoom out
        this.camera.viewProjMatrix.scale(0.9);
    }
    if(keysPressed.P){ //change click
        keysPressed.P = false;
        this.clickForNew = !this.clickForNew;
        console.log(this.clickForNew);
    }
    if(keysPressed.N){
        keysPressed.N = false;
        if(this.square)
        {
          this.newGameObject = new GameObject(new Mesh(this.stripedMaterialYellow,this.quadGeometry));
          this.newGameObject.scale = (0.2, 0.2, 0.2);
        }
        else
          {
            this.newGameObject = new GameObject(new Mesh(this.stripedMaterialYellow,this.triangleGeometry));
            this.newGameObject.scale = (0.2, 0.2, 0.2);
          }
        this.newGameObject.position.x = this.camera.position.x;
        this.newGameObject.position.y = this.camera.position.y;
        this.gameObjects.push(this.newGameObject);
        this.square = !this.square;
        this.index = this.gameObjects.length - 1;
    }
    if(keysPressed.BACK_SPACE){
        keysPressed.BACK_SPACE = false;
        this.gameObjects.splice(this.index,this.index+1);
        if(this.index > 0)
          this.index -= 1;
    }
    if(mouseClick[0] && !this.clickForNew)
    {
      // mouseClick[0] = false;
      const oldX = this.mouseClick[0] - this.gameObject.position.x;
      const oldY = this.mouseClick[1] - this.gameObject.position.y;
      const newX = mouseClick[1] - this.gameObject.position.x;
      const newY = mouseClick[2] - this.gameObject.position.y;
      const delta = Math.atan2(newX,newY) - Math.atan2(oldX,oldY);
      this.gameObject.orientation = delta;
      this.mouseClick[0] = mouseClick[1];
      this.mouseClick[1] = mouseClick[2];
    }
    if(mouseClick[0] && this.clickForNew){
      mouseClick[0] = false;
      if(this.square)
      {
        this.newGameObject = new GameObject(new Mesh(this.stripedMaterialYellow,this.quadGeometry));
        this.newGameObject.scale = (0.2, 0.2, 0.2);
      }
      else
        {
          this.newGameObject = new GameObject(new Mesh(this.stripedMaterialYellow,this.triangleGeometry));
          this.newGameObject.scale = (0.2, 0.2, 0.2);
        }
      //normalize with the camera movement
      this.newGameObject.position.x = mouseClick[1] + this.camera.position.x;
      this.newGameObject.position.y = mouseClick[2] + this.camera.position.y;
      this.gameObjects.push(this.newGameObject);
      this.square = !this.square;
      this.index = this.gameObjects.length - 1;
    }
    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(const gameObject of this.gameObjects){
        gameObject.update();
    }
    for(const gameObject of this.gameObjects){
        gameObject.draw(this.camera);
    }
    this.gameObject.using(this.selectionMaterial).draw(this,this.camera);
  }
}

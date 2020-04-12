    "use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");
    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.programs.push(
        this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));
    this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background-vs.glsl");
    this.programs.push(
        this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsTextured));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);

    this.gameObjects = [];
    this.backgroundMaterial = new Material(this.backgroundProgram);
    this.backgroundMaterial.colorTexture.set(new Texture2D(gl, "media/background.jpg"));
    this.backgroundMesh = new Mesh(this.backgroundMaterial, this.texturedQuadGeometry);
    this.background = new GameObject( this.backgroundMesh );
    this.background.update = function(){};
    this.gameObjects.push(this.background);

    this.flamesMaterial = new Material(this.texturedProgram);
    this.flamesMaterial.colorTexture.set(new Texture2D(gl, "media/afterburner.png"));
    this.flamesMesh = new Mesh(this.flamesMaterial, this.texturedQuadGeometry);
    this.flames = new GameObject(this.flamesMesh);
    // this.flames.position.set(-14.3,-12.75);
    this.flames.position.set(-1.08,0.3);
    this.flames.orientation = Math.PI - 0.2;
    this.flames.scale = (0.7,0.7,0.7);
    this.gameObjects.push(this.flames);

    this.raiderMaterial = new Material(this.texturedProgram);
    this.raiderMaterial.colorTexture.set(new Texture2D(gl, "media/raider.png"));
    this.raiderMesh = new Mesh(this.raiderMaterial, this.texturedQuadGeometry);
    this.avatar = new GameObject( this.raiderMesh );
    this.avatar.position.set(-13, -13);
    this.gameObjects.push(this.avatar);

    this.plasmaMaterial = new Material(this.texturedProgram);
    this.plasmaMaterial.colorTexture.set(new Texture2D(gl, "media/plasma.png"));
    this.plasmaMesh = new Mesh(this.plasmaMaterial, this.texturedQuadGeometry);

    this.asteroidMaterial = new Material(this.texturedProgram);
    this.asteroidMaterial.colorTexture.set(new Texture2D(gl, "media/asteroid.png"));
    this.asteroidMesh = new Mesh(this.asteroidMaterial, this.texturedQuadGeometry);
    const genericMove = function(t, dt){
      const acceleration = new Vec3(this.force).mul(this.invMass);
      const momentum = 0.0;
      const initial_velocity = momentum * this.invMass;
      this.velocity.addScaled(dt, initial_velocity);
      this.velocity.addScaled(dt, acceleration);
      this.position.addScaled(dt, this.velocity);
    };

    for(let i=0; i < 64; i++){
      const asteroid = new GameObject( this.asteroidMesh );
      asteroid.position.setRandom(new Vec3(-12, -12, 0), new Vec3(12, 12, 0) );
      asteroid.velocity.setRandom(new Vec3(-2, -2, 0), new Vec3(2, 2, 0));
      asteroid.angularVelocity = Math.random(-2, 2);
      this.gameObjects.push(asteroid);
      asteroid.move = genericMove;
    }


    this.avatar.backDrag = 0.9;
    this.avatar.sideDrag = 0.5;
    this.avatar.angularDrag = 0.5;
    // this.avatar.aheadVector = new Vec3();
    this.avatar.thrust = 0;
    this.avatar.control = function(t, dt, keysPressed, colliders){
      this.thrust = 0;
      this.torque = 0;
      if(keysPressed.LEFT){this.torque += 1;}
      if(keysPressed.RIGHT){this.torque -= 1;}
      if(keysPressed.UP){
        this.thrust += 1;
      }
      if(keysPressed.DOWN){
        this.thrust -= 1;
      }
    };
    const theta = this.avatar.orientation;
    const avatarMove = function(t,dt){
      this.aheadVector = new Vec3(Math.cos(theta), Math.sin(theta),0);
      this.force = (this.aheadVector).mul(this.thrust); // avatar does not move if the up or down key is not being held
      const acceleration = new Vec3(this.force).mul(this.invMass);
      const momentum = 0.0;
      const initial_velocity = momentum * this.invMass;
      this.velocity.addScaled(dt, initial_velocity);
      this.velocity.addScaled(dt, acceleration);
      this.position.addScaled(dt, this.velocity);
      // this.velocity.mul(Math.exp(-dt * c * this.invMass));

      const angularAcceleration = this.torque * this.invAngularMass;
      this.angularVelocity += angularAcceleration * dt;
      this.orientation += this.angularVelocity * dt;
    };
    // console.log(this.avatar.force);
    this.avatar.invMass = 0.5;
    // this.flames.invMass = 0.5;
    this.avatar.move = avatarMove;
    this.flames.parent = this.avatar;
    // this.flames.move = avatarMove;
    // this.flames.control = this.avatar.control;

    // this.avatar.move = function(t, dt) {
      // this.aheadVector = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation),0);
      // this.force = new Vec3(this.aheadVector).mul(this.thrust); // avatar does not move if the up or down key is not being held
      // const acceleration = new Vec3(this.force).mul(this.invMass);
      // const momentum = 0.0;
      // const initial_velocity = momentum * this.invMass;
      // this.velocity.addScaled(dt, initial_velocity);
      // this.velocity.addScaled(dt, acceleration);
      // this.position.addScaled(dt, this.velocity);
      // // this.velocity.mul(Math.exp(-dt * c * this.invMass));
      //
      // const angularAcceleration = this.torque * this.invAngularMass;
      // this.angularVelocity += angularAcceleration * dt;
      // this.orientation += this.angularVelocity * dt;
    // };
    // this.flames.control = this.avatar.control;

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.camera = new OrthoCamera(...this.programs);
    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.BLEND);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA);
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

    this.camera.position = this.avatar.position;
    this.camera.update();

    if(keysPressed.SPACE){
      // this.plasma = new GameObject(this.plasmaMesh);
      // this.gameObjects.push.(this.plasma);
      this.plasma = new GameObject(this.plasmaMesh);
      this.plasma.position.set(-13, -13);
      this.plasma.scale.set(0.3,0.3,0.3);
      console.log(this.plasma);
      console.log(this.gameObjects);
      // this.plasma.move =
      this.gameObjects.push(this.plasma);
    }

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(const gameObject of this.gameObjects) {
      gameObject.control(t, dt, keysPressed, this.gameObjects);
    }

    for(const gameObject of this.gameObjects) {
      gameObject.move(t, dt);
    }

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
        gameObject.draw(this, this.camera);
    }
  }
}

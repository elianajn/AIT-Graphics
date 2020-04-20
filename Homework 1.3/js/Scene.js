    "use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];
    this.lastShoot = 0;

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
    this.flames.position.set(-1.08,0.3);
    this.flames.orientation = Math.PI - 0.2;
    this.flames.scale = (0.7,0.7,0.7);

    this.flamesRight = new GameObject(this.flamesMesh);
    this.flamesRight.position.set(-0.75,-0.75);
    this.flamesRight.orientation = 5*Math.PI/4 - 0.3;
    this.flamesRight.scale = (0.4,0.4,0.4);

    this.flamesLeft = new GameObject(this.flamesMesh);
    this.flamesLeft.position.set(-0.75,1.0);
    this.flamesLeft.orientation = 3*Math.PI/4 + 0.3;
    this.flamesLeft.scale = (0.4,0.4,0.4);

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
    const asteroidControl = function(t, dt, keysPressed, colliders){
      for(const collider of colliders){
        if(this === collider){continue;}
        var a = collider.position.x - this.position.x;
        var b = collider.position.y - this.position.y;
        var difference = Math.sqrt( a*a + b*b );

        let combinedRadii = collider.boundingRadius + this.boundingRadius;
        if(difference < combinedRadii){
          // console.log("collision!!");
          this.interact(t, dt, collider);
        }


      }
    };
    const asteroidInteract = function(t, dt, collider){
      var a = collider.position.x - this.position.x;
      var b = collider.position.y - this.position.y;
      var difference = Math.sqrt( a*a + b*a );
      // console.log(difference);
      let normal = new Vec2(a,b);
      // let normal = difference.direction();
      // let normal =
      this.position.addScaled(-0.5,normal);
      collider.position.addScaled(0.5,normal);
      let relativeVelocity = this.velocity.minus(collider.velocity);
      let impMag = normal.dot(relativeVelocity) / (1/this.momentum + 1/collider.momentum) * (2);
      this.velocity.addScaled(-impMag, normal);
      collider.velocity.addScaled(-impMag, normal);
    };
    for(let i=0; i < 30; i++){
      const asteroid = new GameObject( this.asteroidMesh );
      asteroid.position.setRandom(new Vec3(-24, -24, 0), new Vec3(12, 12, 0) );
      asteroid.velocity.setRandom(new Vec3(-2, -2, 0), new Vec3(2, 2, 0));
      asteroid.angularVelocity = Math.random(-2, 2);
      this.gameObjects.push(asteroid);
      asteroid.move = genericMove;
      asteroid.interact = asteroidInteract;
      asteroid.control = asteroidControl;
    }

    const remove = function(ary, elem) {
      var i = ary.indexOf(elem);
      if (i >= 0) ary.splice(i, 1);
      return ary;
    };


    this.avatar.backDrag = 0.1;
    this.avatar.sideDrag = 0.5;
    this.avatar.angularDrag = 0.8;
    this.avatar.thrust = 0;
    var gameObjects = this.gameObjects;
    var flames = this.flames;
    var flamesRight = this.flamesRight;
    var flamesLeft = this.flamesLeft;
    this.avatar.invMass = 100.0;
    this.flames.parent = this.avatar;
    this.flamesRight.parent = this.avatar;
    this.flamesLeft.parent = this.avatar;
    this.avatar.control = function(t, dt, keysPressed, colliders){
      this.thrust = 0;
      this.torque = 0;
      remove(gameObjects, flames);
      remove(gameObjects, flamesRight);
      remove(gameObjects, flamesLeft);
      if(keysPressed.LEFT){
        this.torque += 1;
        gameObjects.push(flamesRight);
      }
      if(keysPressed.RIGHT){
        this.torque -= 1;
        gameObjects.push(flamesLeft);
      }
      if(keysPressed.UP){
        this.thrust += 1;
        gameObjects.push(flames);
      }
      if(keysPressed.DOWN){
        this.thrust -= 1;
        gameObjects.push(flamesRight);
        gameObjects.push(flamesLeft);
      }
      for(const collider of colliders){
        if(this === collider){continue;}
        var a = collider.position.x - this.position.x;
        var b = collider.position.y - this.position.y;
        var difference = Math.sqrt( a*a + b*b );

        let combinedRadii = collider.boundingRadius + this.boundingRadius;
        if(difference < combinedRadii){
          // console.log("collision!!");
          this.interact(t, dt, collider);
        }
      }
    };

    this.avatar.interact = function(t, dt, other){

    };


    this.avatar.move = function(t, dt) {
      //forward movement
      this.aheadVector = new Vec3(Math.cos(this.orientation), Math.sin(this.orientation),0);
      this.force = (this.aheadVector).mul(this.thrust); // avatar does not move if the up or down key is not being held
      const acceleration = new Vec3(this.force).mul(this.invMass);
      const momentum = 0.0;
      const initial_velocity = momentum * this.invMass;
      this.velocity.addScaled(dt, initial_velocity);
      this.velocity.addScaled(dt, acceleration);
      this.position.addScaled(dt, this.velocity);
      this.velocity.mul(Math.exp(-dt * this.backDrag * this.invMass));

      const angularAcceleration = this.torque * this.invAngularMass;
      this.angularVelocity += angularAcceleration * dt;
      this.angularVelocity *= Math.exp(-dt * this.angularDrag * this.invAngularMass);
      this.orientation += this.angularVelocity * dt;
    };
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

    const theta = this.avatar.orientation;

    if(keysPressed.SPACE){
      keysPressed.SPACE = false;
      if((t - this.lastShoot) > 1.0){
        this.plasma = new GameObject(this.plasmaMesh);
        this.plasma.position.set(this.avatar.position);
        this.plasma.scale.set(0.3,0.3,0.3);
        this.plasma.move = function(t, dt){
          this.aheadVector = new Vec3(Math.cos(theta), Math.sin(theta),0);
          this.force = new Vec3(this.aheadVector).mul(20.0);
          const acceleration = new Vec3(this.force).mul(this.invMass);
          this.velocity.addScaled(dt, acceleration);
          this.position.addScaled(dt, this.velocity);
        };
        this.gameObjects.push(this.plasma);
        this.lastShoot = t;
      }
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

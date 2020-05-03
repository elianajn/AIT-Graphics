"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");

    // PROGRAMS
    this.programs = [];
    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");
    this.fsProcedural = new Shader(gl, gl.FRAGMENT_SHADER, "procedural-fs.glsl");
    this.vsBackground = new Shader(gl, gl.VERTEX_SHADER, "background-vs.glsl");
    this.fsBackground = new Shader(gl, gl.FRAGMENT_SHADER, "background-fs.glsl");
    this.programs.push(this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));
    this.programs.push(this.proceduralProgram = new TexturedProgram(gl, this.vsTextured, this.fsProcedural));
    this.programs.push(this.backgroundProgram = new TexturedProgram(gl, this.vsBackground, this.fsBackground));
    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);

    // TIME
    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    // MATERIALS
    this.material = new Material(this.texturedProgram);
    this.material.colorTexture.set(new Texture2D(gl, "media/usa.jpg"));

    this.slowpokeMaterial = new Material(this.texturedProgram);
    this.slowpokeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonDh.png"));
    this.eyeMaterial = new Material(this.texturedProgram);
    this.eyeMaterial.colorTexture.set(new Texture2D(gl, "media/slowpoke/YadonEyeDh.png"));

    this.proceduralMaterial = new Material(this.proceduralProgram);
    this.proceduralMaterial.lightMarbleColor.set(1, 0.8, 0.7);
    this.proceduralMaterial.darkMarbleColor.set(0, 0, 0.5);
    this.proceduralMaterial.freq = 40.0;
    this.proceduralMaterial.noiseExp = 2;
    this.proceduralMaterial.noiseFreq = 25;
    this.proceduralMaterial.noiseAmp = 100;
    this.backgroundMaterial = new Material(this.backgroundProgram);
    this.envTexture = new TextureCube(gl, [
      "media/posx512.jpg",
      "media/negx512.jpg",
      "media/posy512.jpg",
      "media/negy512.jpg",
      "media/posz512.jpg",
      "media/negz512.jpg",]
      );
    this.backgroundMaterial.envTexture.set(this.envTexture);

    this.ballMaterial = new Material(this.texturedProgram);
    this.ballMaterial.colorTexture.set(new Texture2D(gl, "media/ball.png"));

    // MESHES
    this.mesh = new MultiMesh(gl, "media/slowpoke/Slowpoke.json",[this.slowpokeMaterial, this.eyeMaterial]);
    this.proceduralMesh = new Mesh(this.proceduralMaterial, this.texturedQuadGeometry);
    this.marbleBallMesh = new MultiMesh(gl, "media/sphere.json", [this.proceduralMaterial]);
    this.ballMesh = new MultiMesh(gl, "media/sphere.json", [this.ballMaterial]);
    this.backgroundMesh = new Mesh(this.backgroundMaterial, this.texturedQuadGeometry);

    // GAME OBJECTS
    this.gameObjects = [];
    this.background = new GameObject(this.backgroundMesh);
    this.avatar =  new GameObject(this.mesh);
    this.avatar.position.set(0, 1, 0);
    this.avatar.scale.set(0.3, 0.3, 0.3);
    this.gameObjects.push(this.background);
    this.gameObjects.push(this.avatar);

    const genericMove = function(t, dt){
      const ahead = new Vec3( Math.sin(this.yaw), 0, Math.cos(this.yaw));
      this.velocity.addScaled(dt * this.invMass, this.force);
      this.position.addScaled(dt, this.velocity);
      this.angularVelocity += dt * this.invAngularMass * this.torque;
      this.yaw += dt * this.angularVelocity;
      const aheadVelocityMagnitude = ahead.dot(this.velocity);
      const aheadVelocity = ahead.times(aheadVelocityMagnitude);
      const sideVelocity = this.velocity.minus(aheadVelocity);
      this.velocity.set(0, 0, 0);
      this.velocity.addScaled(Math.pow(this.backDrag, dt), aheadVelocity);
      this.velocity.addScaled(Math.pow(this.sideDrag, dt), sideVelocity);
      this.angularVelocity *= Math.pow(this.angularDrag, dt);
    };
    const ballControl = function(t, dt, keysPressed, colliders){
      for(const collider of colliders){
        if(this === collider){continue;}
        var a = collider.position.x - this.position.x;
        var b = collider.position.y - this.position.y;
        var difference = Math.sqrt( a*a + b*b );

        let combinedRadii = collider.boundingRadius + this.boundingRadius;
        if(difference < combinedRadii){
          console.log("collision!!");
          // this.interact(t, dt, collider);
        }
      }
    };

    const ballInteract = function(t, dt, obj){
      const diff = this.position.minus(obj.position);
      if(diff.length() < 0.4)
      {
        const norm = diff.direction();
        const epsilon = 1.0;
        const J = (obj.velocity.minus(this.velocity)).dot(norm) * (1.0 + epsilon) / 2.0;
        this.velocity.addScaled(J, norm);
        obj.velocity.addScaled(-J, norm);
        obj.position.addScaled(-0.01, norm);
      }
    };
      // var a = collider.position.x - this.position.x;
      // var b = collider.position.y - this.position.y;
      // var difference = Math.sqrt( a*a + b*a );
      // let normal = new Vec3(a,b,0);
      // this.position.addScaled(-0.5,normal);
      // collider.position.addScaled(0.5,normal);
      // let relativeVelocity = this.velocity.minus(collider.velocity);
      // let impMag = normal.dot(relativeVelocity) / (1/this.momentum + 1/collider.momentum) * (2);
      // console.log(normal);
      // this.velocity.addScaled(-impMag, normal);
      // collider.velocity.addScaled(-impMag, normal);
    // }
    // };
    //   {
    //     const norm = diff.direction();
    //     const epsilon = 1.0;
    //     const J = (obj.velocity.minus(this.velocity)).dot(norm) * (1.0 + epsilon) / 2.0;
    //     this.velocity.addScaled(J, norm);
    //     obj.velocity.addScaled(-J, norm);
    //     obj.position.addScaled(-0.01, norm);
    //   }
    // }


    for(let i=0; i < 10; i++){
      const ball = new GameObject( this.ballMesh );
      ball.position.setRandom(new Vec3(-22, 1, -22, 0), new Vec3(22, 1, 22) );
      ball.velocity.setRandom(new Vec3(-2, 0, -2), new Vec3(2, 0, 2));
      this.gameObjects.push(ball);
      ball.move = genericMove;
      ball.control = ballControl;
      ball.interact = ballInteract;
    }
    for(let i=0; i < 10; i++){
      const ball = new GameObject( this.marbleBallMesh );
      ball.position.setRandom(new Vec3(-22, 1, -22, 0), new Vec3(22, 1, 22) );
      ball.velocity.setRandom(new Vec3(-2, 0, -2), new Vec3(2, 0, 2));
      this.gameObjects.push(ball);
      ball.move = genericMove;
      ball.control = ballControl;
      ball.interact = ballInteract;
    }

    this.avatar.backDrag = 0.9;
    this.avatar.sideDrag = 0.5;
    this.avatar.angularDrag = 0.5;
    this.avatar.control = function(t, dt, keysPressed, colliders){
      this.thrust = 0;
      if(keysPressed.UP) {
        this.thrust += 5;
      }
      if(keysPressed.DOWN) {
        this.thrust -= 5;
      }
      this.torque = 0;
      if(keysPressed.LEFT) {
        this.torque += 2;
      }
      if(keysPressed.RIGHT) {
        this.torque -= 2;
      }
      let ahead = new Vec3( Math.sin(this.yaw), 0, Math.cos(this.yaw));
      this.force = ahead.times(this.thrust);

      const relativeVelocity = new Vec2();
      let diff = new Vec3();
      for(let i=0; i<colliders.length; i++) {
        const other = colliders[i];
        if(other === this) {
          continue;
        }
        diff.set(this.position).sub(other.position);
        const dist2 = diff.dot(diff);
        if(dist2 < 4) {
          diff.mul( 1.0 / Math.sqrt(dist2) );
          this.position.addScaled(0.05, diff);
          other.position.addScaled(-0.05, diff);
          let tangent = diff.cross(new Vec3(0, 1, 0));
          let vi = this.velocity;
          let bi = this.angularVelocity;
          let vj = other.velocity;
          let bj = other.angularVelocity;
          relativeVelocity.set(vi).sub(vj).addScaled(-bi - bj, tangent).mul(0.5);
          const impulseLength = diff.dot(relativeVelocity);
          diff.mul( impulseLength * 1.5 /*restitution*/ );
          const frictionLength = tangent.dot(relativeVelocity);
          tangent.mul(frictionLength * 0.5 /*friction*/);
          vi.sub(diff).sub(tangent);
          vj.add(diff).add(tangent);
          this.angularVelocity += frictionLength /* *radius*/ ;
          other.angularVelocity += frictionLength  /* *radius*/ ;
        }
      }
    };
    this.avatar.move = genericMove;
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
      gameObject.control(t, dt, keysPressed, this.gameObjects);
    }

    // for(let i = 0; i < this.gameObjects.length; i++)
    // {
    //   for(let j = i + 1; j < this.gameObjects.length; j++)
    //   {
    //     this.gameObjects[i].interact(t, dt, this.gameObjects[j]);
    //   }
    // }

    for(const gameObject of this.gameObjects) {
      gameObject.move(t, dt);
    }

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
        gameObject.draw(this, this.camera);
    }
    this.camera.avatarPosition.set(this.avatar.position);

    this.camera.move(dt, keysPressed);
  }
}

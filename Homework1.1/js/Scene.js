"use strict";
/* exported Scene */
class Scene {
  constructor(gl) {
    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
    // this.triangleGeometry = new TriangleGeometry(gl);
    // this.quadGeometry = new QuadGeometry(gl);
    // this.starGeometry = new StarGeometry(gl);
    // this.heartGeometry = new HeartGeometry(gl);
    // this.crescentGeometry = new CrescentGeometry(gl);
    this.donutGeometry = new DonutGeometry(gl);
    this.eggGeometry = new EggGeometry(gl);
    this.avatar_position = {x:0, y:0, z:0};
    this.eggUniform = {x:-0.7, y:0.5, z:0};
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false

    // clear the screen
    gl.clearColor(0, 0.3, 0.3, 0.9);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // if(keysPressed.RIGHT){this.avatar_position.x += 0.01;}
    // if(keysPressed.LEFT){this.avatar_position.x -= 0.01;}
    // if(keysPressed.UP){this.avatar_position.y += 0.01;}
    // if(keysPressed.DOWN){this.avatar_position.y -= 0.01;}

    gl.useProgram(this.solidProgram.glProgram);
    // this.triangleGeometry.draw();
    // this.quadGeometry.draw();
    // gl.uniform(vec4, this.eggUniform.x, this.eggUniform.y, this.eggUniform.z);
    // this.heartGeometry.draw();

    const objectPositionHandle = gl.getUniformLocation(this.solidProgram.glProgram, "gameObject.position");
    if (objectPositionHandle == null){
      console.log("could not find uniform: gameObject.position");
    } else {
      gl.uniform3f(objectPositionHandle, 0.0, 0.0, 0.0);
    }
    this.donutGeometry.draw();
    gl.uniform3f(objectPositionHandle, this.eggUniform.x, this.eggUniform.y, this.eggUniform.z);
    this.eggGeometry.draw();
    
    // this.eggGeometry.draw();
    // this.triangleGeometry.draw();
  }
}

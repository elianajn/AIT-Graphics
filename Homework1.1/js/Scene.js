"use strict";
/* exported Scene */
class Scene {
  constructor(gl) {
    this.vsIdle = new Shader(gl, gl.VERTEX_SHADER, "idle-vs.glsl");
    this.vsRandom = new Shader(gl, gl.VERTEX_SHADER, "random-vs.glsl");
    this.fsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "solid-fs.glsl");
    this.fsChecker = new Shader(gl, gl.FRAGMENT_SHADER, "checker-fs.glsl");
    this.fsClear = new Shader(gl, gl.FRAGMENT_SHADER, "clear-fs.glsl");
    this.fsHeartbeat = new Shader(gl, gl.FRAGMENT_SHADER, "heartbeat-fs.glsl");

    this.solidProgram = new Program(gl, this.vsIdle, this.fsSolid);
    this.checkerProgram = new Program(gl, this.vsIdle, this.fsChecker);
    this.clearProgram = new Program(gl, this.vsIdle, this.fsClear);
    this.jumpProgram = new Program(gl, this.vsRandom, this.fsClear);
    this.heartbeatProgram = new Program(gl, this.vsIdle, this.fsHeartbeat);

    this.donutGeometry = new DonutGeometry(gl);
    this.eggGeometry = new EggGeometry(gl);
    this.starGeometry = new StarGeometry(gl);
    this.avatar_position = {x:0, y:0, z:0};
    this.eggUniform = {x:-0.7, y:0.5, z:0};
    this.mode = "HEARTBEAT";

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

    if(keysPressed.C){this.mode = "CHECKERED";}
    if(keysPressed.S){this.mode = "SOLID";}
    if(keysPressed.E){this.mode = "EGGS";}
    if(keysPressed.X){this.mode = "HEARTBEAT";}
    if(keysPressed.J){this.mode = "JUMP";}
    if(keysPressed.RIGHT){this.avatar_position.x += 0.01;}
    if(keysPressed.LEFT){this.avatar_position.x -= 0.01;}
    if(keysPressed.UP){this.avatar_position.y += 0.01;}
    if(keysPressed.DOWN){this.avatar_position.y -= 0.01;}
    if(this.avatar_position.x <= -1.3) { this.avatar_position.x = 1.3;}
    else if(this.avatar_position.x >= 1.3) { this.avatar_position.x = -1.3;}
    if(this.avatar_position.y <= -1.3) { this.avatar_position.y = 1.3;}
    else if(this.avatar_position.y >= 1.3) { this.avatar_position.y = -1.3;}



    gl.useProgram(this.solidProgram.glProgram);
    var objectPositionHandle = gl.getUniformLocation(this.solidProgram.glProgram, "gameObject.position");
    if (objectPositionHandle == null){
      console.log("could not find uniform: gameObject.position");
    } else {
      gl.uniform3f(objectPositionHandle, 0.0, 0.0, 0.0);
    }

    gl.useProgram(this.checkerProgram.glProgram);
    var objectColorHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "checkGameObject.usercolor");
    var objectSizeHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "checkGameObject.checker_size");
    // if (objectColorHandle == null){
    //   console.log("could not find uniform: checkGameObject.usercolor");
    // } else 
    {
      // gl.uniform4f(objectColorHandle, 10.0, 1.0, 0.0, 0.0, 0.0);
      gl.uniform1f(objectColorHandle, 1.0);
      gl.uniform1f(objectSizeHandle, 15.0);
    }









    // this.donutGeometry.draw();
    objectPositionHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "gameObject.position");
    gl.uniform3f(objectPositionHandle, this.eggUniform.x, this.eggUniform.y, this.eggUniform.z);

    // this.eggGeometry.draw();
    
    // this.eggGeometry.draw();
    // this.triangleGeometry.draw();

    switch(this.mode)
    {
      case "SOLID":
        gl.useProgram(this.clearProgram.glProgram);
        objectPositionHandle = gl.getUniformLocation(this.clearProgram.glProgram, "gameObject.position");
        this.starGeometry.draw();
        break;
      case "CHECKERED":
        gl.useProgram(this.checkerProgram.glProgram);
        objectPositionHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "gameObject.position");
        this.donutGeometry.draw();
        break;
      case "EGGS":
        gl.useProgram(this.clearProgram.glProgram);
        objectPositionHandle = gl.getUniformLocation(this.clearProgram.glProgram, "gameObject.position");
        gl.uniform3f(objectPositionHandle, 0.0, 0.0, 0.0);
        this.eggGeometry.draw();
        gl.useProgram(this.checkerProgram.glProgram);
        objectPositionHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "gameObject.position");
        gl.uniform3f(objectPositionHandle, 0.5, -0.5, 0.0);
        this.eggGeometry.draw();
        gl.uniform3f(objectPositionHandle, -0.5, 0.5, 0.0);
        var objectColorHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "checkGameObject.usercolor");
        gl.uniform1f(objectColorHandle, 0.1);
        var objectSizeHandle = gl.getUniformLocation(this.checkerProgram.glProgram, "checkGameObject.checker_size");
        gl.uniform1f(objectSizeHandle, 25.0);
        this.eggGeometry.draw();
        break;
      case "HEARTBEAT":
        var date = new Date();
        var timestamp = date.getTime();
        gl.useProgram(this.heartbeatProgram.glProgram);
        objectPositionHandle = gl.getUniformLocation(this.heartbeatProgram.glProgram, "gameObject.position");
        gl.uniform3f(objectPositionHandle, this.avatar_position.x, this.avatar_position.y, this.avatar_position.z);
        var heartbeatTimeHandle = gl.getUniformLocation(this.heartbeatProgram.glProgram, "heartbeatGameObject.dt");
        gl.uniform1f(heartbeatTimeHandle, Math.sin(timestamp/500));
        this.donutGeometry.draw();
        break;
      case "JUMP":
        gl.useProgram(this.jumpProgram.glProgram);
        var randomPositionHandle = gl.getUniformLocation(this.jumpProgram.glProgram, "randomGameObject.position");
        gl.uniform3f(randomPositionHandle, 0.0, 0.0, 0.0);
        this.eggGeometry.draw();
        var that = this;
        // this.set = setInterval(function(){ 
        //   gl.uniform3f(randomPositionHandle, Math.random()*2-1, Math.random()*2-1, Math.random());
        //   that.eggGeometry.draw();
        //   console.log("moving");
        // }, 2000);
        gl.uniform3f(randomPositionHandle, Math.random()*2-1, Math.random()*2-1, Math.random());
        this.eggGeometry.draw();
        break;
    }
  }
}

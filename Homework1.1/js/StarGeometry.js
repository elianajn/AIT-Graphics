"use strict";
/* exported TriangleGeometry */
class StarGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.vertex_array = new Float32Array(3*11);
    var R = 0.5;
    var r = 0.2;
    var theta = 36 * (Math.PI/180);
    this.vertex_array = new Float32Array(3*11);
    this.vertex_array[0] = 0;
    this.vertex_array[1] = 0;
    this.vertex_array[2] = 0.5;
    var counter = 3;
    var small_rad = true;
    var rad = this.r;
    for(var i = -(18 * (Math.PI/180)); i < (2*Math.PI); i += theta)
    {
      if(small_rad){rad = r;}
      else{rad = R;}
      this.vertex_array[counter] = Math.cos(i) * rad;
      counter++;
      this.vertex_array[counter] = Math.sin(i) * rad;
      counter++;
      this.vertex_array[counter] = 0.5;
      counter++;
      small_rad = !small_rad;
    }

    gl.bufferData(gl.ARRAY_BUFFER,
      this.vertex_array,
      gl.STATIC_DRAW);


    //hw:add new vertexbuffer for color
    this.vertexColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColor);
    this.color_array = new Float32Array(3*11);
    for (var i = 0; i < (3*11); i++){
      this.color_array[i] = Math.random();
    }
    gl.bufferData(gl.ARRAY_BUFFER,
        this.color_array,
        gl.STATIC_DRAW);

        // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.unit_array = new Uint16Array(12);
        for (var i = 0; i < 12; i++){
          this.unit_array[i] = i;
          if (i == 11) { this.unit_array[i] = 1; }
        }
        console.log(this.unit_array);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
          this.unit_array,
          gl.STATIC_DRAW);

    // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
    this.inputLayout = gl.createVertexArray();
    gl.bindVertexArray(this.inputLayout);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    //hw: binding enabling new vertexColor above. This below is the "input layout specification"
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColor);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindVertexArray(null);
  }

  draw() {
    const gl = this.gl;

    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    gl.drawElements(gl.TRIANGLE_FAN, 12, gl.UNSIGNED_SHORT, 0); //gl.TRIANGLES, gl.TRIANGLE_FAN
  }
}

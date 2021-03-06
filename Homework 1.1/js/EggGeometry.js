"use strict";
/* exported TriangleGeometry */
class EggGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.vertex_array = new Float32Array(3*11);
    var R = 0.5;
    var r = 0.2;
    var l = 0.1;
    var a = 0.2;
    var b = 0.05;

    var alpha = 5 * (Math.PI/180);
    this.vertex_array = new Float32Array(3*72);
    this.vertex_array[0] = 0;
    this.vertex_array[1] = 0;
    this.vertex_array[2] = 0.5;
    var counter = 3;
    var small_rad = true;
    var rad = this.r;
    for(var theta = (Math.PI/180); theta < (2*Math.PI); theta += alpha)
    {
      this.vertex_array[counter] = l*Math.cos(theta) + (a + b*Math.cos(theta))*Math.cos(theta);
      counter++;
      this.vertex_array[counter] = (a + b*Math.cos(theta))*Math.sin(theta);
      counter++;
      this.vertex_array[counter] = 0.5;
      counter++;
    }

    gl.bufferData(gl.ARRAY_BUFFER,
      this.vertex_array,
      gl.STATIC_DRAW);


    //hw:add new vertexbuffer for color
    this.vertexColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColor);
    this.color_array = new Float32Array(3*72);
    this.color_array[0] = 0.824;
    this.color_array[1] = 0.706;
    this.color_array[2] = 0.549;
    for (var i = 3; i < (3*72); i++){
      if(i%3 === 0)
        this.color_array[i] = 0.569;
      if(i%3 === 1)
        this.color_array[i] = 0.506;
      if(i%3 === 2)
        this.color_array[i] = 0.318;
    }
       
    gl.bufferData(gl.ARRAY_BUFFER,
        this.color_array,
        gl.STATIC_DRAW);

        // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.unit_array = new Uint16Array(73);
        for (var i = 0; i < 73; i++){
          this.unit_array[i] = i;
          if (i == 72) { this.unit_array[i] = 1; }
        }
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

    gl.drawElements(gl.TRIANGLE_FAN, 73, gl.UNSIGNED_SHORT, 0); //gl.TRIANGLES, gl.TRIANGLE_FAN
  }
}

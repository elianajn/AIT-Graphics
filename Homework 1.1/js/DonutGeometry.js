"use strict";
/* exported TriangleGeometry */
class DonutGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.vertex_array = new Float32Array(3*147);
    var R = 0.3;
    var r = 0.2;
    var theta = 5 * (Math.PI/180);
    this.vertex_array = new Float32Array(3*147);
    this.vertex_array[0] = 0;
    this.vertex_array[1] = 0;
    this.vertex_array[2] = 0.5;
    var counter = 3;
    var small_rad = true;
    var rad = this.r;
    for(var i = 0; i < (2*Math.PI); i += theta)
    {
      this.vertex_array[counter] = Math.cos(i) * R;
      counter++;
      this.vertex_array[counter] = Math.sin(i) * R;
      counter++;
      this.vertex_array[counter] = 0.5;
      counter++;
    }
        for(var i = 0; i < (2*Math.PI); i += theta)
    {
      this.vertex_array[counter] = Math.cos(i) * r;
      counter++;
      this.vertex_array[counter] = Math.sin(i) * r;
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
    this.color_array = new Float32Array(3*147);
    this.color_array[0] = 0.2;
    this.color_array[1] = 0.1;
    this.color_array[2] = 0.3;
    for (var i = 0; i < (3*147); i++){
      if(i%3 === 0)
        this.color_array[i] = 0.8;
      if(i%3 === 1)
        this.color_array[i] = 0.2;
      if(i%3 === 2)
        this.color_array[i] = 0.3;
    }
    gl.bufferData(gl.ARRAY_BUFFER,
        this.color_array,
        gl.STATIC_DRAW);

        // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.unit_array = new Uint16Array(146);
        for (var i = 0; i < 73; i++){
          this.unit_array[i] = i;
          if (i == 72) { this.unit_array[i] = 1; }
        }
        for(var i = 73; i < 146; i ++)
        {
          this.unit_array[i] = i-1;
          if (i == 145) { this.unit_array[i] = 74; }
          if (i == 73) { this.unit_array[i] = 0; }
        }

        var outer_counter = 1;
        var inner_counter = 74;
        for(var i = 0; i < 146; i++)
        {
          if(i % 2 === 0){
            this.unit_array[i] = outer_counter;
            outer_counter++;
          }
          else{
            this.unit_array[i] = inner_counter;
            inner_counter++;
          }
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

    gl.drawElements(gl.TRIANGLE_STRIP, 146, gl.UNSIGNED_SHORT, 0); //gl.TRIANGLES, gl.TRIANGLE_FAN
  }
}

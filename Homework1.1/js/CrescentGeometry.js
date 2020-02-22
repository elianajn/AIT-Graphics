"use strict";
/* exported TriangleGeometry */
class CrescentGeometry {
  constructor(gl) {
    this.gl = gl;

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.vertex_array = new Float32Array(3*61);
    var R = 0.5;
    var r = 0.6;
    var theta = 5 * (Math.PI/180);
    this.vertex_array = new Float32Array(3*61);
    this.vertex_array[0] = 0;
    this.vertex_array[1] = 0;
    this.vertex_array[2] = 0.5;
    var counter = 3;
    for(var i = 0.8916; i < (Math.PI + 0.8916); i += theta)
    {
      this.vertex_array[counter] = Math.cos(i) * R;
      counter++;
      this.vertex_array[counter] = Math.sin(i) * R;
      counter++;
      this.vertex_array[counter] = 0.5;
      counter++;
    }
    console.log(counter);
    for (var i = 1.397; i <(Math.PI + 0.1909); i += theta)
    {
      this.vertex_array[counter] = (Math.cos(i) * r) + 0.2;
      counter++;
      this.vertex_array[counter] = Math.sin(i) * r - 0.2;
      counter++;
      this.vertex_array[counter] = 0.5;
      counter++;
    }
    console.log(counter);
    console.log(this.vertex_array);
    gl.bufferData(gl.ARRAY_BUFFER,
      this.vertex_array,
      gl.STATIC_DRAW);


    //hw:add new vertexbuffer for color
    this.vertexColor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColor);
    this.color_array = new Float32Array(3*61);
    this.color_array[0] = 0.2;
    this.color_array[1] = 0.1;
    this.color_array[2] = 0.3;
    for (var i = 3; i < (3*61); i++){
      if(i%3 === 0)
        this.color_array[i] = 0.8;
      if(i%3 === 1)
        this.color_array[i] = 0.2;
      if(i%3 === 2)
        this.color_array[i] = 0.3;
    }
    console.log(this.vertexColor);
    gl.bufferData(gl.ARRAY_BUFFER,
        this.color_array,
        gl.STATIC_DRAW);

        // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.unit_array = new Uint16Array(62);
        
        // for (var i = 0; i < 62; i++){
        //   this.unit_array[i] = i;
        //   if (i == 61) { this.unit_array[i] = 1; }
        // }
        // for(var i = 77; i < 155; i ++)
        // {
        //   this.unit_array[i] = i;
        //   if(i == 77)
        //     this.unit_array[i] = 0;
        //   if(i == 154)
        //     this.unit_array[i] = 77;
        // }

        this.unit_array[0] = 1;
        this.unit_array[1] = 2;
        this.unit_array[2] = 78;
        var counter_outer_circle = 3;
        var counter_inner_circle = 79;
        for (var i = 3; i < 62; i ++)
        {
          if(i % 2 === 1)
          {
            this.unit_array[i] = counter_outer_circle;
            counter_outer_circle++;
          }
          else
          {
            this.unit_array[i] = counter_inner_circle;
            counter_inner_circle++;
          }
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

    gl.drawElements(gl.TRIANGLE_STRIP, 62, gl.UNSIGNED_SHORT, 0); //gl.TRIANGLES, gl.TRIANGLE_FAN
  }
}

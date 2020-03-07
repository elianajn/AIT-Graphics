Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;

  uniform struct{
  	vec4 solidColor;
  } material;

  void main(void) {
    fragmentColor = color * material.solidColor;
  }
`;
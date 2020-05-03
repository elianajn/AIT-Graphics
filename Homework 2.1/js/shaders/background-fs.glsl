Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 rayDir;

  uniform struct{
  	vec4 solidColor;
    samplerCube envTexture;
  } material;

  uniform struct {
    float time;
  } scene;

  void main(void) {
     fragmentColor = texture(material.envTexture, rayDir.xyz);
  }
`;

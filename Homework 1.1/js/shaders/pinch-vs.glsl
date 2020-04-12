Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexColor; // attribute from VB
  out vec4 color; // passed to FS
  out vec4 worldPosition;

  uniform struct{
    float time;
  } pinchGameObject;

  void main(void) {
    gl_Position = vertexPosition;
    gl_Position.xyz *= pow(sin(length(vertexPosition)/8.0), abs(pinchGameObject.time));
    worldPosition = vertexPosition;
    color = vertexColor;

  }
`;
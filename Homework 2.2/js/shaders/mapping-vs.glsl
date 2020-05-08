Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  // 3 inputs
  in vec4 vertexPosition;
  in vec4 vertexTexCoord;
  in vec3 vertexNormal;

  // 2 outputs
  out vec4 worldPosition;
  out vec4 worldNormal;

  uniform struct {
  	mat4 modelMatrix;
    mat4 modelMatrixInverse;
  } gameObject;

  uniform struct {
    mat4 viewProjMatrix;
    vec3 position;
  } camera;

  void main(void) {
    worldNormal = gameObject.modelMatrixInverse * vec4(vertexNormal.xyz, 0);
    worldPosition = vertexPosition * gameObject.modelMatrix;
    gl_Position = vertexPosition * gameObject.modelMatrix * camera.viewProjMatrix;

  }
`;

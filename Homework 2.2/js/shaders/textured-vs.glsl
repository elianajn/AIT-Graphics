Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  in vec4 vertexPosition;
  in vec4 vertexTexCoord;
  in vec3 vertexNormal;

  out vec4 tex; // passed to FS
  out vec4 color;
  out vec4 worldNormal;
  out vec4 modelPosition;
  out vec4 worldPosition;

  uniform struct {
  	mat4 modelMatrix;
    mat4 modelMatrixInverse;
  } gameObject;

  uniform struct {
    mat4 viewProjMatrix;
    vec3 worldPosition;
  } camera;

  uniform struct {
   vec4 position;
   vec3 powerDensity;
   } lights[8];

  void main(void) {
  	tex = vertexTexCoord;
    modelPosition = vertexPosition;
    worldPosition = vertexPosition * gameObject.modelMatrix;
    worldNormal = gameObject.modelMatrixInverse * vec4(vertexNormal.xyz, 0);
    gl_Position = vertexPosition * gameObject.modelMatrix * camera.viewProjMatrix;
  }
`;

Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;
  //2 inputs
  in vec4 worldNormal;
  in vec4 worldPosition;

  out vec4 fragmentColor;

  uniform struct {
    float time;
  } scene;

  uniform struct {
    mat4 viewProjMatrix;
    vec3 position;
  } camera;

  uniform struct {
    samplerCube envmapTexture;
  } material;


  void main(void) {
     vec3 normal = normalize(worldNormal.xyz);
     vec3 viewDirection = normalize(camera.position - worldPosition.xyz);
     vec3 reflectedRayDirection = reflect(-viewDirection, normal);
     fragmentColor = texture(material.envmapTexture, reflectedRayDirection);
     //fragmentColor.rgb = normalize(abs(normal));
  }
`;

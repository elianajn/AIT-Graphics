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

  vec3 noiseGrad(vec3 r) {
    uvec3 s = uvec3(
      0x1D4E1D4E,
      0x58F958F9,
      0x129F129F);
    vec3 f = vec3(0, 0, 0);
    for(int i=0; i<16; i++) {
      vec3 sf =
      vec3(s & uvec3(0xFFFF))
    / 65536.0 - vec3(0.5, 0.5, 0.5);

      f += cos(dot(sf, r)) * sf;
      s = s >> 1;
    }
    return f;
  }



  void main(void) {
     vec3 perturbedNormal = normalize(worldNormal.xyz + noiseGrad(worldPosition.xyz*10.0));
     vec3 viewDirection = normalize(camera.position - worldPosition.xyz);
     vec3 reflectedRayDirection = reflect(-viewDirection, perturbedNormal);
     fragmentColor = texture(material.envmapTexture, reflectedRayDirection);
  }
`;

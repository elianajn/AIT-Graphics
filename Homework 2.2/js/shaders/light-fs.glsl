Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;

  in vec4 color;
  in vec4 tex;
  in vec4 worldNormal;

  uniform struct{
  	vec4 solidColor;
  	sampler2D colorTexture;
  } material;

  uniform struct {
    float time;
  } scene;

  uniform struct {
   vec4 position;
   vec3 powerDensity;
   } lights[8];


  void main(void) {
     vec4 texColor = material.solidColor * cos(scene.time) * 0.01 + texture(material.colorTexture, tex.xy);
     vec3 lightDir = normalize(vec3(1, 1, 1));
     vec3 normal = normalize(worldNormal.xyz);
     float cosa = clamp(dot(lightDir, normal), 0.0, 1.0);
     fragmentColor = texColor * cosa;
  }
`;

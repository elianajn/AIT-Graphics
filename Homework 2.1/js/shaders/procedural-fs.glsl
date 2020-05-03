Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 modelPosition;

  uniform struct{
    vec3 lightMarbleColor;
    vec3 darkMarbleColor;
    float freq;
    float noiseFreq;
    float noiseExp;
    float noiseAmp;
  } material;

  uniform struct {
    float time;
  } scene;

  float snoise(vec3 r) {
    vec3 s = vec3(7502, 22777, 4767);
    float f = 0.0;
    for(int i=0; i<16; i++) {
      f += sin( dot(s - vec3(32768, 32768, 32768), r)/ 65536.0);
      s = mod(s, 32768.0) * 2.0 + floor(s / 32768.0);
    }
    return f / 32.0 + 0.5;
  }

  void main(void) {
     float w = pow( ( sin ( modelPosition.x * material.freq + pow ( snoise ( modelPosition.xyz * material.noiseFreq), material.noiseExp)*material.noiseAmp ) + 1.0) / 2.0, 4.0);
     vec3 color = mix(material.lightMarbleColor, material.darkMarbleColor, w);
     fragmentColor.xyz = color.xyz;
  }
`;

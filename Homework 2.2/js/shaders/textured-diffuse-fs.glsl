Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;

  in vec4 color;
  in vec4 tex;
  in vec4 worldNormal;
  in vec4 worldPosition;

  uniform struct{
  	//vec4 solidColor;
  	sampler2D colorTexture;
    vec3 specularColor;
    float shininess;
  } material;

  uniform struct {
    float time;
  } scene;

  uniform struct {
   vec4 position;
   vec3 powerDensity;
   } lights[8];

   uniform struct {
    mat4 viewProjMatrix;
    vec3 worldPosition;
   } camera;

   vec3 shade(vec3 normal, vec3 lightDir,vec3 powerDensity, vec3 materialColor) {
    float cosa = clamp( dot(lightDir, normal),0.0,1.0);
    return powerDensity * materialColor * cosa;
    }

  vec3 shade(vec3 normal, vec3 lightDir, vec3 viewDir,
               vec3 powerDensity, vec3 materialColor,
               vec3 specularColor, float shininess)      {

     float cosa = clamp( dot(lightDir, normal), 0.0, 1.0);
     vec3 halfway = normalize(viewDir + lightDir);
     float cosDelta = clamp(dot(halfway, normal), 0.0, 1.0);
     return powerDensity * materialColor * cosa + powerDensity * specularColor * pow(cosDelta, shininess);
     }


  void main(void) {
     vec3 color = vec3(0, 0, 0);
     for (int i = 0; i < 2; i++){
      vec3 lightDiff = lights[i].position.xyz;
      vec3 lightDir = normalize(lightDiff);
      float distanceSquared = dot(lightDiff, lightDiff);
      vec3 powerDensity = lights[i].powerDensity;
      if (lights[i].position.w == 1.0)
      {
        lightDiff -= worldPosition.xyz;
        powerDensity = powerDensity / distanceSquared;
      }

      vec3 normal = normalize(worldNormal.xyz);
      //fragmentColor.rgb += shade(normal, lightDir,powerDensity,texture(material.colorTexture, tex.xy/tex.w).rgb);
      color += shade(normal, lightDir,powerDensity,texture(material.colorTexture, tex.xy/tex.w).rgb);
      //color += shade(normal, lightDir, viewDir, powerDensity, texture(material.colorTexture, tex.xy/tex.w).rgb, material.specularColor, material.shininess);
    }
    fragmentColor = vec4(color, 1.0);
  }
`;

Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 rayDir;

  uniform struct {
  	samplerCube envTexture;
    //sampler2D colorTexture;
    vec3 materialColor;
    vec3 specularColor;
    float shininess;
    float freq;
    float noiseFreq;
    float noiseExp;
    float noiseAmp;
    vec3 lightWoodColor;
    vec3 darkWoodColor;
  } material;

  uniform struct {
    mat4 viewProjMatrix;
    mat4 rayDirMatrix;
    vec3 position;
  } camera;

  uniform struct {
   vec4 position;
   vec3 powerDensity;
  } lights[8];

  uniform struct {
    mat4 surface;
    mat4 clipper;
  } clippedQuadrics[16];

  float snoise(vec3 r) {
    vec3 s = vec3(7502, 22777, 4767);
    float f = 0.0;
    for(int i=0; i<16; i++) {
      f += sin( dot(s - vec3(32768, 32768, 32768), r) / 65536.0);
      s = mod(s, 32768.0) * 2.0 + floor(s / 32768.0);
      }
    return f / 32.0 + 0.5;
  }

  float intersectQuadric(mat4 A, vec4 e, vec4 d) {
    float a = dot(d * A, d);
    float b = dot(d * A, e) + dot(e * A, d);
    float c = dot(e * A, e);
    float discriminant = b*b-4.0*a*c;
    if (discriminant < 0.0){
      return -1.0;
    }
    float t1 = (-1.0*b - sqrt(discriminant))/(2.0*a);
    float t2 = (-1.0*b + sqrt(discriminant))/(2.0*a);
    return (t1<0.0)?t2:((t2<0.0)?t1:min(t1, t2));
  }

  float intersectClippedQuadric(mat4 A, mat4 B, vec4 e, vec4 d){
    float a = dot(d * A, d);
    float b = dot(d * A, e) + dot(e * A, d);
    float c = dot(e * A, e);
    float discriminant = b*b-4.0*a*c;
    if (discriminant < 0.0){
      return -1.0;
      }
    float t1 = (-1.0*b - sqrt(discriminant))/(2.0*a);
    float t2 = (-1.0*b + sqrt(discriminant))/(2.0*a);
    vec4 r1 = e + d * t1;
    vec4 r2 = e + d * t2;
    if(dot(r1*B, r1) > 0.0){
      t1 = -1.0;
    }
    if(dot(r2*B, r2) > 0.0){
      t2 = -1.0;
    }
    return (t1<0.0)?t2:((t2<0.0)?t1:min(t1, t2));
  }

  bool findBestHit(vec4 e, vec4 d, out float bestT, out int bestIndex){
    bestT = 10000.0;
    for(int i = 0; i < clippedQuadrics.length(); i++){ //fixed to the number of clippedQuadrics
      float t = intersectClippedQuadric(clippedQuadrics[i].surface, clippedQuadrics[i].clipper, e, d);
      if (t > 0.0 && t < bestT){
        bestT = t;
        bestIndex = i;
      }
    }
    if (bestT != 10000.0) return true;
    return false;
  }

  vec3 shadeDiffuse(vec3 normal, vec3 lightDir,vec3 powerDensity, vec3 materialColor) {
   float cosa = clamp( dot(lightDir, normal),0.0,1.0);
   return powerDensity * materialColor * cosa;
   }

  vec3 shadeSpecular(vec3 normal, vec3 lightDir, vec3 viewDir,
                vec3 powerDensity, vec3 materialColor,
                vec3 specularColor, float shininess) {
    float cosa = clamp( dot(lightDir, normal), 0.0, 1.0);
    float cosb = clamp(dot(viewDir, normal), 0.0, 1.0);
    vec3 halfway = normalize(viewDir + lightDir);
    float cosDelta = clamp(dot(halfway, normal), 0.0, 1.0);
    return powerDensity * materialColor * cosa + powerDensity
           * specularColor * pow(cosDelta, shininess) * cosa / max(cosb, cosa);
  }

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

  void main(void){
	  vec4 e = vec4(camera.position, 1);		 //< ray origin
  	vec4 d = vec4(normalize(rayDir).xyz, 0); //< ray direction

    float t;
    int index;

    bool hitFound = findBestHit(e, d, t, index);

    if (!hitFound){
      // nothing hit by ray, return enviroment color
      fragmentColor = texture(material.envTexture, d.xyz );
    }
    else{
      vec4 hit = e + d * t;
      vec3 normal = normalize((hit * clippedQuadrics[index].surface + clippedQuadrics[index].surface * hit).xyz);
      if (dot(normal, d.xyz) > 0.0) normal = -normal;

      for (int i = 0; i < lights.length(); i++){
        vec3 lightDir = lights[i].position.xyz;
        vec3 powerDensity = lights[i].powerDensity;

        // Shadows
        vec4 shadowOrigin = hit + 0.01 * vec4(normal, 0);
        vec4 shadowDirection = vec4(lightDir, 0);

        float bestShadowT;
        int bestShadowIndex;
        bool shadowRayHitSomething = findBestHit(shadowOrigin, shadowDirection,
          bestShadowT, bestShadowIndex);

        if(!shadowRayHitSomething) {
          if(index == 0 || index == 1){ //queen, made of wood
            float w = fract(hit.x * material.freq + pow(snoise(hit.xyz * material.noiseFreq),material.noiseExp)* material.noiseAmp);
            vec3 color = mix(material.lightWoodColor, material.darkWoodColor, w);
            fragmentColor.rgb += shadeDiffuse(normal, lightDir, powerDensity, color);
          }
          else if(index == 2 || index == 3){ //pawn, made of plastic
            vec3 viewDir = -d.xyz;
            fragmentColor.rgb += shadeSpecular(normal, lightDir, viewDir, powerDensity, material.materialColor, material.specularColor, material.shininess);
          }
          else if(index == 4 || index == 5){ //pawn, made of plastic, with noise
            vec3 viewDir = -d.xyz;
            vec3 noisyNormal = normalize(normal.xyz + noiseGrad(hit.xyz*5.0));
            fragmentColor.rgb += shadeSpecular(noisyNormal, lightDir, viewDir, powerDensity, material.materialColor, material.specularColor, material.shininess);
          }
        }
      }
    }
    gl_FragDepth = 0.9999;

  }

`;

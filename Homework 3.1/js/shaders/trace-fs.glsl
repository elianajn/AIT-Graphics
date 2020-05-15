Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es
  precision highp float;

  out vec4 fragmentColor;
  in vec4 rayDir;

  uniform struct {
  	samplerCube envTexture;
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
    if(dot(r1*B, r1) < 0.0){
      t1 = -1.0;
    }
    if(dot(r2*B, r2) < 0.0){
      t2 = -1.0;
    }
    return (t1<0.0)?t2:((t2<0.0)?t1:min(t1, t2));
  }

  // TODO: write findBestHit when you figure out how to make shapes actually
  // if you have hit position and normal you can just shade
  bool findBestHit(vec4 e, vec4 d, out float bestT, out int bestIndex){
    bestT = 10000.0;
    for(int i = 0; i < 1; i++){ //fixed to the number of clippedQuadrics
      float t = intersectClippedQuadric(clippedQuadrics[i].surface, clippedQuadrics[i].clipper, e, d);
      if (t > 0.0 && t < bestT){
        bestT = t;
        bestIndex = i;
      }
    }

    if (bestT != 10000.0) return true;
    return false;
  }


  void main(void) {
    vec4 e = vec4(camera.position, 1);            //< ray origin
    vec4 d = vec4(normalize(rayDir).xyz, 0);      //< ray direction
    //////////////////////
    mat4 A = mat4(1,  0,  0,  0,
                     0,  0,  0,  0,
                     0,  0,  1,  0,
                     0,  0,  0, -1);
    mat4 B = mat4(0,  0,  0,  0,
                     0,  1,  0,  0,
                     0,  0,  0,  0,
                     0,  0,  0, -1);
    intersectClippedQuadric(A,B,e,d);
    ///////////////
    float t;
    int index;

    bool hitFound = findBestHit(e, d, t, index);
    if(!hitFound){ // nothing hit by ray, return enviroment color
      fragmentColor = texture(material.envTexture, d.xyz);
    }
    else{
      vec4 hit = e + d * t;
      vec3 normal = normalize( (hit * clippedQuadrics[index].surface + clippedQuadrics[index].surface * hit).xyz );
      //normal = -normal;
      //if (dot(normal, d.xyz) > 0.0){
      //  normal = -normal;
      //}
      //fragmentColor.rgb = normal;
      fragmentColor.rgb = vec3(1, 1, 1) * abs(normal.z);
    }


    // computing depth from world space hit coordinates ...

    // lights
    for (int i = 0; i < 2; i++){
      //vec3 lightDiff = lights[i].position.xyz - hit.xyz * lights[i].position.w;
      vec3 lightDiff = lights[i].position.xyz;
      vec3 lightDir = normalize(lightDiff);
      float distanceSquared = dot(lightDiff, lightDiff);
      vec3 powerDensity = lights[i].powerDensity/distanceSquared;
      if (lights[i].position.w == 1.0)
      {
        //lightDiff -= worldPosition.xyz;
        powerDensity = powerDensity / distanceSquared;
      }
    }

    gl_FragDepth = 0.9999;
  }

`;

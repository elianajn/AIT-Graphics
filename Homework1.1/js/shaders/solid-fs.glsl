Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color; // received from VS via RS
  in vec4 worldPosition;

//  uniform struct{
//  	vec4 colors;
//  } gameObject;
	uniform float checker_size;


float checker(vec4 uv, float repeats) 
{
  float cx = floor(repeats * worldPosition.x);
  float cy = floor(repeats * worldPosition.y); 
  float result = mod(cx + cy, 2.0);
  return sign(result);
}

  void main(void) {
    fragmentColor = vec4(1, 0.0, 1, 0.7);
    fragmentColor = color;
	fragmentColor = vec4(fract(worldPosition.x * 10.0), .5, 0.5, 1);

	float chessboard = floor(worldPosition.y);
	
	float c = mix(1.0, 0.0, checker(worldPosition, 15.0));


	float x = float(fract(worldPosition.y * 10.0));
	//float x = fract(worldPosition.y * 10.0), .5, 0.5, 1
	fragmentColor = vec4(c, c, c, 1);
	// fragementColor = vec4(mod (worldPosition.x,2), 0.5, 0.5, 1);

	// bool isEven = mod(total,2.0)==0.0;
    // vec4 col1 = vec4(0.0,0.0,0.0,1.0);
    //vec4 col2 = vec4(1.0,1.0,1.0,1.0);
    //fragmentColor = (isEven)? col1:col2;

  }
`;
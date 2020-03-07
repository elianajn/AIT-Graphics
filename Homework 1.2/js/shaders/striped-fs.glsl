Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color;
  in vec4 modelPosition;

  uniform struct{
  	vec4 solidColor;
  	float stripeWidth;
  } material;

  void main(void) {
  	vec4 stripedColor = material.solidColor;
  	if(fract((modelPosition.x + modelPosition.y) / material.stripeWidth) < 0.5)
	  	stripedColor.rgb = vec3(1, 1, 1) - stripedColor.rgb;
    fragmentColor = color * stripedColor;
    //fragmentColor = stripedColor;
  }
`;
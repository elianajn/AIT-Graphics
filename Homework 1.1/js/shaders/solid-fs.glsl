Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color; // received from VS via RS
  in vec4 worldPosition;


  void main(void) {
    fragmentColor = vec4(1, 0.0, 1, 0.7);
    fragmentColor = color;
	fragmentColor = vec4(0.5, 0.5, 0.5, 1);
  }
`;
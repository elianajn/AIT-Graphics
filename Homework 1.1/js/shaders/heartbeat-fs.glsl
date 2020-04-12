Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 color; // received from VS via RS
  in vec4 worldPosition;


	uniform struct{
    float dt;
  } heartbeatGameObject;



  void main(void) {
	  fragmentColor = vec4(0.3, heartbeatGameObject.dt, 0.9, 1);
  }
`;
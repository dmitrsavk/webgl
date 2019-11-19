// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;

void main() {
  gl_Position = a_Position;
  gl_PointSize = 2.0;
}

`;

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
uniform vec4 u_FragColor;

void main() {
  gl_FragColor = u_FragColor;;
}
`;

function main() {
  const dots = [];
  const dotsColor = [];

  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.2, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //canvas.addEventListener("mousemove", onMouseMove);

  let x = 0;
  let y = 0;
  let r = 0.01;

  function render() {
    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    x += 0.01;
    r += 0.01;

    y = Math.sqrt(r * r - x * x);

    dots.push([x, y]);

    dotsColor.push([1.0, 0.0, 0.0, 1]);

    for (let i = 0; i < dots.length; i++) {
      const coords = dots[i];
      const color = dotsColor[i];

      gl.vertexAttrib3fv(a_Position, new Float32Array([...coords, 0.0]));
      gl.uniform4fv(u_FragColor, new Float32Array(color));
      gl.drawArrays(gl.POINTS, 0, 1);
    }

    //requestAnimationFrame(render);
  }

  render();
}

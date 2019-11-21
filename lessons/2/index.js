// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_xformMatrix;

void main() {
  gl_Position = u_xformMatrix * a_Position;
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

function initVertexBuffer(gl) {
  const n = 3;

  const vertices = new Float32Array([
    -0.5,
    -0.5, //
    0.0,
    0.5, //
    0.5,
    -0.5 //
  ]);

  const vertexBuffer = gl.createBuffer();

  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  return n;
}

let angle = 45.0;

function main() {
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

  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  gl.uniform4fv(u_FragColor, new Float32Array([0.0, 1.0, 0.0, 1.0]));

  let xformMatrix = new Matrix4();
  xformMatrix.setRotate(angle, 0, 0, 1);

  const u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix");
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);


  gl.clearColor(0.0, 0.0, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const n = initVertexBuffer(gl);

  if (n < 0) {
    console.log("Failed to set the positions of the vertices’");
    return;
  }

  function render() {
    angle += 5;

    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    xformMatrix.setRotate(angle, 0, 0, 1);
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    requestAnimationFrame(render);
  }

  render();
}

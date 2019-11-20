// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform vec4 u_Translation;

uniform float u_Sin;
uniform float u_Cos;
uniform float u_Tx;

void main() {
  gl_Position.x = a_Position.x * u_Cos - a_Position.y * u_Sin + u_Tx;
  gl_Position.y = a_Position.x * u_Sin + a_Position.y * u_Cos;
  gl_Position.z = a_Position.z;
  gl_Position.w = a_Position.w;
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
let Tx = 0.01;

let sin = Math.sin((angle * Math.PI) / 180);

let cos = Math.cos((angle * Math.PI) / 180);

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

  const u_Sin = gl.getUniformLocation(gl.program, "u_Sin");
  gl.uniform1f(u_Sin, sin);

  const u_Cos = gl.getUniformLocation(gl.program, "u_Cos");
  gl.uniform1f(u_Cos, cos);

  const u_Tx = gl.getUniformLocation(gl.program, "u_Tx");
  gl.uniform1f(u_Tx, Tx);

  gl.clearColor(0.0, 0.0, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const n = initVertexBuffer(gl);

  if (n < 0) {
    console.log("Failed to set the positions of the vertices’");
    return;
  }

  function render() {
    angle++;
    Tx += 0.01;

    if (Tx >= 1.5) Tx = -1.5;

    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(u_Sin, Math.sin((angle * Math.PI) / 180));
    gl.uniform1f(u_Cos, Math.cos((angle * Math.PI) / 180));
    gl.uniform1f(u_Tx, Tx);

    gl.drawArrays(gl.TRIANGLES, 0, n);

    requestAnimationFrame(render);
  }

  render();
}

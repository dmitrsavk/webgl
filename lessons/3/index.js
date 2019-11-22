// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_Point_size;
attribute vec4 a_Color;

varying vec4 v_Color;

void main() {
  gl_Position = a_Position;
  gl_PointSize = a_Point_size;
  v_Color = a_Color;
}
`;

// Fragment shader program
var FSHADER_SOURCE = `
precision mediump float;
varying vec4 v_Color;

uniform float u_Time;

void main() {
  float x = (gl_FragCoord.x / 400.0) * 2.0 - 1.0;
  float y = (gl_FragCoord.y / 400.0) * 2.0 - 2.0;

  float r = sqrt(x * x + y * y);

  float red = 1.0 - r;

  gl_FragColor = vec4(sin(red * u_Time), v_Color.y, v_Color.z, v_Color.w);
}
`;


function initVertexBuffer(gl) {
  const n = 3;

  const verticesSizes = new Float32Array([
    -1.0,
    1.0,
    1.0,
    1.0,
    0.0,
    0.0, //
    -1.0,
    -1.0,
    4.0,
    1.0,
    0.0,
    0.0, //
    1.0,
    1.0,
    6.0,
    1.0,
    0.0,
    0.0, //
    1.0,
    -1.0,
    6.0,
    1.0,
    0.0,
    0.0
  ]);

  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

  const vertexBuffer = gl.createBuffer();

  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");

  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  const a_Point_size = gl.getAttribLocation(gl.program, "a_Point_size");

  if (a_Point_size < 0) {
    console.log("Failed to get the storage location of a_Point_size");
    return;
  }

  gl.vertexAttribPointer(
    a_Point_size,
    1,
    gl.FLOAT,
    false,
    FSIZE * 6,
    FSIZE * 2
  );
  gl.enableVertexAttribArray(a_Point_size);

  const a_Color = gl.getAttribLocation(gl.program, "a_Color");

  if (a_Color < 0) {
    console.log("Failed to get the storage location of a_Color");
    return;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);
  //

  return n;
}

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

  //
  const u_Time = gl.getUniformLocation(gl.program, "u_Time");

  if (u_Time < 0) {
    console.log("Failed to get the storage location of u_Time");
    return;
  }
  //

  const n = initVertexBuffer(gl);

  if (n < 0) {
    console.log("Failed to set the positions of the vertices’");
    return;
  }

  const start = Date.now();


  function render() {
    const now = Date.now();

    gl.uniform1f(u_Time, (now - start) / 10);

    gl.clearColor(0.0, 0.0, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
  }

  render();
}

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

void main() {
  gl_FragColor = v_Color;;
}
`;

function initVertexBuffer(gl) {
  const n = 3;

  const verticesSizes = new Float32Array([
    -0.5, -0.5, 2.0, 1.0, 0.0, 0.0, //
    0.0, 0.5, 4.0, 0.0, 1.0, 0.0, //
    0.5, -0.5, 6.0, 0.0, 0.0, 1.0, //
  ]);

  const FSIZE = verticesSizes.BYTES_PER_ELEMENT;;

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

  gl.vertexAttribPointer(a_Point_size, 1, gl.FLOAT, false, FSIZE * 6, FSIZE * 2);
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

  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  gl.uniform4fv(u_FragColor, new Float32Array([0.0, 1.0, 0.0, 1.0]));


  gl.clearColor(0.0, 0.0, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const n = initVertexBuffer(gl);

  if (n < 0) {
    console.log("Failed to set the positions of the vertices’");
    return;
  }

  gl.drawArrays(gl.LINE_LOOP, 0, n);
}

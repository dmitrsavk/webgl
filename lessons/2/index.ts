// HelloPoint1.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  "void main() {\n" +
  "  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n" + // Set the vertex coordinates of the point
  "  gl_PointSize = 10.0;\n" + // Set the point size
  "}\n";

// Fragment shader program
var FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + // Set the point color
  "}\n";

function initVertexBuffer(gl: WebGLRenderingContext): number {
  const n = 3;

  const vertices = new Float32Array([
    -0.5, -0.5,
    0.0, 0.5,
    0.5, -0.5
  ]);

  const vertexBuffer = gl.createBuffer();

  if (!vertexBuffer) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, "a_Position");
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position)

  return n;
}

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl: WebGLRenderingContext = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    gl.vertexAttrib4f();
    return;
  }
gl.vertexAttrib4f

  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");

  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  gl.clearColor(0.0, 0.0, 0.2, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const n = initVertexBuffer(gl);

  if (n < 0) {
    console.log("Failed to set the positions of the vertices’");
    return;
  }

  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

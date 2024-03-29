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
    gl.uniform4fv
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.2, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a point
  gl.drawArrays(gl.TRIANGLES, 0, 1);

  gl.vertexAttrib3fv(a, new Float32Array([1.0, 1.0, 1.0]))
}

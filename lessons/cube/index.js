// HelloCube.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_MvpMatrix;
  varying vec4 v_Color;

  void main() {
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;
  }
`

// Fragment shader program
var FSHADER_SOURCE =`
  #ifdef GL_ES
  precision mediump float;
  #endif

  varying vec4 v_Color;

  void main() {
    gl_FragColor = v_Color;
  }
`

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
     1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  // v0 White
    -1.0,  1.0,  1.0,     1.0,  0.0,  0.0,  // v1 Magenta
    -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
     1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v3 Yellow
     1.0, -1.0, -1.0,     1.0,  0.0,  0.0,  // v4 Green
     1.0,  1.0, -1.0,     1.0,  0.0,  0.0,  // v5 Cyan
    -1.0,  1.0, -1.0,     1.0,  0.0,  0.0,  // v6 Blue
    -1.0, -1.0, -1.0,     1.0,  0.0,  0.0   // v7 Black
  ]);

 
  var indices = new Uint8Array([
    0, 1, 2,   0, 2, 3,    // front
    0, 3, 4,   0, 4, 5,    // right
    0, 5, 6,   0, 6, 1,    // up
    1, 6, 7,   1, 7, 2,    // left
    7, 4, 3,   7, 3, 2,    // down
    4, 7, 6,   4, 6, 5     // back
  ]);

  var skeletIndexes = new Uint8Array([
    0, 1, 2, 3, 0, 5, 4, 3, 4, 7, 2, 1, 6, 5, 6, 7
  ]);

  var skeletColors = new Float32Array([
    // Vertex coordinates and color
     1.0,  1.0,  1.0,     0.0,  0.0,  0.0,  // v0 White
    -1.0,  1.0,  1.0,     0.0,  0.0,  0.0,  // v1 Magenta
    -1.0, -1.0,  1.0,     0.0,  0.0,  0.0,  // v2 Red
     1.0, -1.0,  1.0,     0.0,  0.0,  0.0,  // v3 Yellow
     1.0, -1.0, -1.0,     0.0,  0.0,  0.0,  // v4 Green
     1.0,  1.0, -1.0,     0.0,  0.0,  0.0,  // v5 Cyan
    -1.0,  1.0, -1.0,     0.0,  0.0,  0.0,  // v6 Blue
    -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
  ]);

  // Set the vertex coordinates and color
  var n = initVertexBuffers(gl, verticesColors, indices);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set clear color and enable hidden surface removal
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage location of u_MvpMatrix
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) { 
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  // Set the eye point and the viewing volume
  var mvpMatrix = new Matrix4();

  let dX = 0;
  let dY = 0;

  function render() {
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    mvpMatrix.rotate(dX, 0, 1, 0);
    mvpMatrix.rotate(dY, 1, 0, 0);

    // Pass the model view projection matrix to u_MvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    gl.bufferData(gl.ARRAY_BUFFER, skeletColors, gl.STATIC_DRAW);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, skeletIndexes, gl.STATIC_DRAW);
    gl.drawElements(gl.LINE_STRIP, skeletIndexes.length, gl.UNSIGNED_BYTE, 0);
  }

  function onKeyDown(event) {
    if (event.keyCode == 39) {
      dX -= 3;
    } else if (event.keyCode == 37) {
      dX += 3;
    } else if (event.keyCode == 38) {
      dY -= 3;
    } else if (event.keyCode == 40) {
      dY += 3;
    }

    render();
  }

  document.addEventListener('keydown', onKeyDown);

  render();
}

function initVertexBuffers(gl, verticesColors, indices) {
  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  var indexBuffer = gl.createBuffer();
  if (!vertexColorBuffer || !indexBuffer) {
    return -1;
  }

  // Write the vertex coordinates and color to the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;
  // Assign the buffer object to a_Position and enable the assignment
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);
  // Assign the buffer object to a_Color and enable the assignment
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  return indices.length;
}

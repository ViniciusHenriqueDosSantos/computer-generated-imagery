const canvasCoordinates =
    document.getElementById(
        "canvasCoordinates"
    );

const webglCoordinates =
    document.getElementById(
        "webglCoordinates"
    );


let vertices = [];
let verticesBresenhan=[]
let colors = [];
let pointSizes = [];

let DOT_COLOR = [1.0, 0.0, 0.0];
let DOT_SIZE = 10.0;


// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW
);


const colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW
);

const pointSizesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(pointSizes),
    gl.STATIC_DRAW
);


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);

gl.enableVertexAttribArray(pointSizeLocation);

gl.vertexAttribPointer(
    pointSizeLocation,
    1,
    gl.FLOAT,
    false,
    0,
    0
);

// --------------------------------------------------
// 9. INTERAÇÃO COM O MOUSE
// --------------------------------------------------

canvas.addEventListener("mousedown",mouseClick,false);

function mouseClick(event){

    // Posição do clique em pixels
    const x = event.offsetX;
    const y = event.offsetY;

    canvasCoordinates.textContent =
        `Canvas: (${x}, ${y})`;

    // Converter X para o intervalo [-1, 1]
    const webglX =
        (x / canvas.width) * 2 - 1;

    // Converter Y para o intervalo [-1, 1]
    // O sinal é invertido porque o eixo Y do canvas
    // cresce para baixo e o do WebGL cresce para cima
    const webglY =
        -((y / canvas.height) * 2 - 1);

    webglCoordinates.textContent =
        `WebGL: (${webglX.toFixed(3)}, ${webglY.toFixed(3)})`;

    drawDot(webglX, webglY);
}

// --------------------------------------------------
// 10. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(0.1, 0.1, 0.1, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 11. DESENHAR
// --------------------------------------------------

const numComponents = 2;

gl.useProgram(program);




  function bresenhan(){
      let [ax, ay] = [vertices[0], vertices[1]];
      const [bx, by] = [vertices[2], vertices[3]];

      const size = 0.01;
      const dx = Math.abs(bx - ax);
      const dy = Math.abs(by - ay);
      const sx = ax < bx ? size : -size;
      const sy = ay < by ? size : -size;

      let err = dx - dy;
      const steps = Math.ceil(Math.max(dx, dy) / size);

      for (let i = 0; i <= steps; i++) {
          drawDot(ax, ay, 'bresenhan');
          const e2 = 2 * err;
          if (e2 > -dy) { err -= dy; ax += sx; }
          if (e2 <  dx) { err += dx; ay += sy; }
      }
  }




function drawDot(x, y,caller='not_bresenhan'){
    if(vertices.length>=4 &&caller==='not_bresenhan'){
        console.log("poppin")
        console.log("Vertices Before: ",vertices)
        vertices=vertices.filter(x=>!verticesBresenhan.includes(x))
        verticesBresenhan=[]
        vertices.splice(0,2)
        console.log("Vertices After: ",vertices)

    }
    if(caller=='bresenhan'){
        verticesBresenhan.push(x,y)
    }
    vertices.push(x, y);
    colors.push(...DOT_COLOR);
    pointSizes.push(DOT_SIZE);

    gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(pointSizes),
        gl.STATIC_DRAW
    );

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.drawArrays(
        gl.POINTS,
        0,
        vertices.length / numComponents
    );

    if(vertices.length===4&&caller=='not_bresenhan'){
        bresenhan()
    }
    console.log("Vertices: ", vertices)
    console.log("Drawing Dot", vertices.length)
}




// --------------------------------------------------
// 10. INTERAÇÃO COM O TECLADO
// --------------------------------------------------

function repaintAll(newColor) {
    DOT_COLOR = Array.from(newColor);
    const dotCount = vertices.length / 2;
    colors = [];
    for (let i = 0; i < dotCount; i++) {
        colors.push(...DOT_COLOR);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, vertices.length / numComponents);
}

document.addEventListener(
  "keydown",
  keyboardClick,
  false
);

function resizeAll(){
    const dotCount = vertices.length / 2;
    pointSizes = [];
    for (let i = 0; i < dotCount; i++) {
        pointSizes.push(DOT_SIZE);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizesBuffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(pointSizes),
        gl.STATIC_DRAW
    );
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, vertices.length / numComponents);
}
function keyboardClick(event) {
    console.log("Click: ",event.key)
  switch(event.key) {
      case "ArrowUp":
        DOT_SIZE+=5
        resizeAll()
        break;
      case "ArrowDown":
        DOT_SIZE-=5
        resizeAll()
        break;
      case "0":
          newColor = new Float32Array([
              1.0, 1.0, 1.0
          ]);
          repaintAll(newColor);
          break;

      case "1":
          newColor = new Float32Array([
              1.0, 0.0, 0.0
          ]);
          repaintAll(newColor);
          break;

      case "2":
          newColor = new Float32Array([
              0.0, 1.0, 0.0
          ]);
          repaintAll(newColor);
          break;

      case "3":
          newColor = new Float32Array([
              0.0, 0.0, 1.0
          ]);
          repaintAll(newColor);
          break;

      case "4":
          newColor = new Float32Array([
              1.0, 1.0, 0.0
          ]);
          repaintAll(newColor);
          break;

      case "5":
          newColor = new Float32Array([
              1.0, 0.0, 1.0
          ]);   
          repaintAll(newColor);
          break;

      case "6":
          newColor = new Float32Array([
              0.0, 1.0, 1.0
          ]);
          repaintAll(newColor);
          break;

      case "7":
          newColor = new Float32Array([
              1.0, 0.5, 0.0
          ]);
          repaintAll(newColor);
          break;

      case "8":
          newColor = new Float32Array([
              0.5, 0.0, 1.0
          ]);
          repaintAll(newColor);
          break;

      case "9":
          newColor = new Float32Array([
              1.0, 0.4, 0.7
          ]);
          repaintAll(newColor);
          
          break;

      default:
          return;
        }
        
    }   
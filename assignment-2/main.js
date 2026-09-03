const canvasCoordinates =
    document.getElementById(
        "canvasCoordinates"
    );

const webglCoordinates =
    document.getElementById(
        "webglCoordinates"
    );


let vertices = [];
let colors = [];
let pointSizes = [];

const DOT_COLOR = [1.0, 0.0, 0.0];
const DOT_SIZE = 10.0;


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

function drawDot(x, y){

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
}

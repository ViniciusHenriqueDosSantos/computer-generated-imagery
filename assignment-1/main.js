

const canvas= document.getElementById('canvas')

canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x_pixel = event.clientX - rect.left;
    const y_pixel = event.clientY - rect.top;

    let x_webgl = (x_pixel / canvas.width) * 2.0 - 1.0;
    
    let y_webgl = (1.0 - (y_pixel / canvas.height)) * 2.0 - 1.0; 

    x_webgl = Math.round(x_webgl * 10) / 10;
    y_webgl = Math.round(y_webgl * 10) / 10;

    console.log(`    ${x_webgl.toFixed(1)}, ${y_webgl.toFixed(1)},     1.0, 0.0, 0.0,`);
});

const gl=canvas.getContext('webgl2')

const vertexShaderSource = `#version 300 es
    in vec2 a_position;
    in vec3 a_color;
    out vec3 v_color;

    void main() {
        gl_Position = vec4(a_position,0.0,1.0);
        v_color = a_color;
    }
` 

const fragmentShaderSource =  `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 outColor;
void main (){
    outColor = vec4(v_color,1.0);
}
`

function createShader(gl,type,source){
    const shader = gl.createShader(type)
    gl.shaderSource(shader,source)
    gl.compileShader(shader)
    return shader;
}

const vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexShaderSource)
const fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource)

const program= gl.createProgram()
gl.attachShader(program,vertexShader)
gl.attachShader(program,fragmentShader)
gl.linkProgram(program)



const flower = new Float32Array([


    0.1,  0.1,     1.0, 0.0, 0.0,
    0.1,  0.4,     1.0, 0.0, 0.0, 
    0.4,  0.1,     1.0, 0.0, 0.0,
    0.4,  0.4,     1.0, 0.0, 0.0,
    0.1,  0.4,     1.0, 0.0, 0.0, 
    0.4,  0.1,     1.0, 0.0, 0.0,

    -0.1,  0.1,     1.0, 0.0, 0.0,
    -0.1,  0.4,     1.0, 0.0, 0.0, 
   -0.4,  0.1,     1.0, 0.0, 0.0,
    -0.4,  0.4,     1.0, 0.0, 0.0,
    -0.1,  0.4,     1.0, 0.0, 0.0, 
   -0.4,  0.1,     1.0, 0.0, 0.0,

      0.1,  -0.1,     1.0, 0.0, 0.0,
    0.1,  -0.4,     1.0, 0.0, 0.0, 
    0.4,  -0.1,     1.0, 0.0, 0.0,
    0.4,  -0.4,     1.0, 0.0, 0.0,
    0.1, -0.4,     1.0, 0.0, 0.0, 
    0.4,  -0.1,     1.0, 0.0, 0.0,

    -0.1,  -0.1,     1.0, 0.0, 0.0,
    -0.1,  -0.4,     1.0, 0.0, 0.0, 
   -0.4,  -0.1,     1.0, 0.0, 0.0,
    -0.4,-0.4,     1.0, 0.0, 0.0,
    -0.1,  -0.4,     1.0, 0.0, 0.0, 
   -0.4,  -0.1,     1.0, 0.0, 0.0,



    0.0,  0.30,     1.0, 1.0, 0.0,
    0.30,  0,     1.0, 1.0, 0.0, 
    -0.30,  0,     1.0, 1.0, 0.0,
    
    0.0,  -0.30,     1.0, 1.0, 0.0,
    0.30,  0,     1.0, 1.0, 0.0,
    -0.30,  0,     1.0, 1.0, 0.0,


0.0, -0.3, 0.0, 1.0, 0.0,
    0.0, -1.0, 0.0, 1.0, 0.0,
    0.01, -1.0, 0.0, 1.0, 0.0,
    0.0, -0.3, 0.0, 1.0, 0.0,
    0.01, -1.0, 0.0, 1.0, 0.0,
    0.01, -0.3, 0.0, 1.0, 0.0
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flower, gl.STATIC_DRAW);


const positionLocation =
    gl.getAttribLocation(program,"a_position")
const colorLocation = gl.getAttribLocation(program, "a_color");
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.enableVertexAttribArray(positionLocation)
gl.enableVertexAttribArray(colorLocation)
const stride=20

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    stride,
    8
)
gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    stride,
    0
)

gl.clearColor(0.0, 0.0, 1.0, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT)





gl.useProgram(program)

gl.drawArrays(
    gl.TRIANGLES,
    0,
    100
)



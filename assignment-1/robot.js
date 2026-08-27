const robot= document.getElementById('robot')

const gl=robot.getContext('webgl2')

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



const robotDrawing = new Float32Array([


    0.3,-0.4,   1,1,1,
    0.3,-1,      1,1,1,
    0.2, -1,        1,1,1,
    0.3,-0.4,   1,1,1,
    0.2,-0.4,      1,1,1,
    0.2, -1,        1,1,1,


    0,-0.4,   1,1,1,
    0,-1,      1,1,1,
    0.1, -1,        1,1,1,
    0,-0.4,   1,1,1,
    0.1,-0.4,      1,1,1,
    0.1, -1,        1,1,1,


     0,0.3,   1,1,1,
    0,-0.4,      1,1,1,
    0.3, -0.4,        1,1,1,
    0,0.3,   1,1,1,
    0.3,0.3,      1,1,1,
    0.3, -0.4,        1,1,1,  


    -0.05,0.7,   1,1,1,
    -0.05,0.3,      1,1,1,
    0.35, 0.3,        1,1,1,
    -0.05,0.7,   1,1,1,
    0.35,0.7,      1,1,1,
    0.35, 0.3,        1,1,1,  



    0,0.6,   0,0,0,
    0.1,0.6,      0,0,0,
    0, 0.5,        0,0,0,
    0.1,0.5,       0,0,0,
    0.1,0.6,      0,0,0,
    0, 0.5,        0,0,0, 


        0.2,0.6,   1,0,0,
    0.3,0.6,      1,0,0,
    0.2, 0.5,        1,0,0,
    0.3,0.5,       1,0,0,
    0.3,0.6,      1,0,0,
    0.2, 0.5,        1,0,0, 




       -0.1,0.25,   1,1,1,
    -0.1,0.175,      1,1,1,
    0.4, 0.175,        1,1,1,
    -0.1,0.25,   1,1,1,
    0.4,0.25,      1,1,1,
    0.4, 0.175,        1,1,1,
    
    
    0.35,0.25,   1,1,1,
    0.4,0.25,      1,1,1,
    0.4, -0.3,        1,1,1,
    0.35,0.25,   1,1,1,
    0.35,-0.3,      1,1,1,
    0.4, -0.3,        1,1,1,


      -0.1,0.25,   1,1,1,
    -0.05,0.25,      1,1,1,
    -0.05, -0.3,        1,1,1,
    -0.1,0.25,   1,1,1,
    -0.1,-0.3,      1,1,1,
    -0.05, -0.3,        1,1,1,

]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, robotDrawing, gl.STATIC_DRAW);


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


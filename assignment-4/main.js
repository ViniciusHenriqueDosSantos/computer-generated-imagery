const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

const vertexShaderSource = `#version 300 es

in vec2 aPosition;

uniform mat3 u_viewTransform;
uniform mat3 u_modelTransform;

void main() {

    vec3 position =
        u_viewTransform *
        u_modelTransform *
        vec3(aPosition, 1.0);

    gl_Position =
        vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec3 uColor;

out vec4 outColor;

void main() {

    outColor =
        vec4(uColor, 1.0);
}
`;

function createShader(gl, type, source) {

    const shader =
        gl.createShader(type);

    gl.shaderSource(
        shader,
        source
    );

    gl.compileShader(shader);

    if (
        !gl.getShaderParameter(
            shader,
            gl.COMPILE_STATUS
        )
    ) {

        const error =
            gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}

function createProgram(
    gl,
    vertexShaderSource,
    fragmentShaderSource
) {

    const vertexShader =
        createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );

    const fragmentShader =
        createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

    const program =
        gl.createProgram();

    gl.attachShader(
        program,
        vertexShader
    );

    gl.attachShader(
        program,
        fragmentShader
    );

    gl.linkProgram(program);

    if (
        !gl.getProgramParameter(
            program,
            gl.LINK_STATUS
        )
    ) {

        throw new Error(
            gl.getProgramInfoLog(program)
        );
    }

    return program;
}


const program =
    createProgram(
        gl,
        vertexShaderSource,
        fragmentShaderSource
    );


// ==================================================
// CLASSE RENDERER
// ==================================================

class Renderer {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;

        this.positionLocation =
            gl.getAttribLocation(
                program,
                "aPosition"
            );

        this.colorLocation =
            gl.getUniformLocation(
                program,
                "uColor"
            );

        this.viewTransformLocation =
            gl.getUniformLocation(
                program,
                "u_viewTransform"
            );

        this.modelTransformLocation =
            gl.getUniformLocation(
                program,
                "u_modelTransform"
            );

        this.viewTransform =
            m3.identity();

        this.verticesBuffer =
            gl.createBuffer();
    }

    defineViewTransform(viewTransform) {
        this.viewTransform =
            viewTransform;
    }

    draw(object) {
        const gl = this.gl;

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            this.verticesBuffer
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            object.vertices,
            gl.STATIC_DRAW
        );

        gl.enableVertexAttribArray(
            this.positionLocation
        );

        gl.vertexAttribPointer(
            this.positionLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        gl.uniform3fv(
            this.colorLocation,
            object.color
        );

        gl.uniformMatrix3fv(
            this.modelTransformLocation,
            false,
            object.modelTransform
        );

        gl.uniformMatrix3fv(
            this.viewTransformLocation,
            false,
            this.viewTransform
        );

        gl.drawArrays(
            gl.TRIANGLES,
            0,
            object.vertices.length / 2
        );
    }
}

// ==================================================
// AUXILIARY FUNCTIONS
// ==================================================

function rectangleVertices(x, y, width, height) {
    return [
        x, y,
        x + width, y + height,
        x, y + height,

        x, y,
        x + width, y,
        x + width, y + height
    ];
}

function circleVertices(radius, numSegments) {
    const vertices = [];

    for (let i = 0; i < numSegments; i++) {
        const theta1 =
            (i / numSegments) *
            2 * Math.PI;

        const theta2 =
            ((i + 1) / numSegments) *
            2 * Math.PI;


        vertices.push(
            0,
            0
        );

        vertices.push(
            radius * Math.cos(theta1),
            radius * Math.sin(theta1)
        );


        vertices.push(
            radius * Math.cos(theta2),
            radius * Math.sin(theta2)
        );
    }

    return vertices;
}

// ==================================================
// ROAD VERTICES
// ==================================================

function roadVertices() {

    const vertices = rectangleVertices(-2.0, -0.4, 4.0, 0.8);

    return new Float32Array(vertices);
}


// ==================================================
// CAR BODYWORK VERTICES
// ==================================================

function robotBodyworkVertices() {

    const vertices = [];

    vertices.push(...rectangleVertices(-0.05, 0.18, 0.1, 0.1));
    vertices.push(...rectangleVertices(-0.1, -0.01, 0.2, 0.2));
    vertices.push(...rectangleVertices(0, 0.2, 0.01, 0.01));

    return new Float32Array(vertices);
}


// ==================================================
// CAR WHEEL VERTICES
// ==================================================

function legsVertices() {

    const vertices = [];


    vertices.push(...rectangleVertices(-0.0175, -0.115, 0.035, 0.115));

    return new Float32Array(vertices);
}


// ==================================================
// CLASSE SCENE OBJECT
// ==================================================

class SceneObject {

    constructor(vertices, color) {

        this.vertices = vertices;

        this.color = color;

        this.modelTransform = m3.identity();
    }

    updateModelTransform(modelTransform) {

        this.modelTransform = modelTransform;
    }
}


// ==================================================
// CLASSE ROAD
// ==================================================

class Road extends SceneObject {

    constructor() {

        super(
            roadVertices(),

            new Float32Array([
                0.2,
                0.2,
                0.2
            ])
        );
    }


    draw(renderer) {

        renderer.draw(this);
    }
}


// ==================================================
// CLASSE CAR BODYWORK
// ==================================================

class RobotBodyWork extends SceneObject {

    constructor(color) {

        super(

            robotBodyworkVertices(),

            color
        );
    }
}


// ==================================================
// CLASSE CAR WHEEL
// ==================================================

class RobotLeg extends SceneObject {

    constructor(xPosition, angularSpeed, yPosition = 0.0) {

        super(

            legsVertices(),

            new Float32Array([
                0.5,
                0.5,
                0.5
            ])
        );

        this.xPosition = xPosition;

        this.yPosition = yPosition;

        this.theta = 0.0;

        this.angularSpeed = angularSpeed;
    }


    updateAngularSpeed(angularSpeed) {

        this.angularSpeed = angularSpeed;
    }

    updateRotation() {
        this.theta += this.angularSpeed
        if (this.theta >= 1 || this.theta <= -1) {
            this.angularSpeed = -this.angularSpeed
        }
    }


    updateModelTransform(carModelTransform) {

        const localTransform =

            m3.multiply(
                m3.translation(this.xPosition, this.yPosition),
                m3.rotation(this.theta)
            );

        this.modelTransform =

            m3.multiply(
                carModelTransform,
                localTransform
            );
    }
}


// ==================================================
// CLASSE CAR
// ==================================================

class Robot {

    constructor(tx, ty, color, speed) {

        this.tx = tx;

        this.ty = ty;

        this.speed = speed;

        this.angularSpeed = -0.1;
        this.firsttime = true

        this.leftLeg = new RobotLeg(-0.05, this.angularSpeed);

        this.rightLeg = new RobotLeg(0.05, this.angularSpeed);
        this.leftArm = new RobotLeg(-0.1, -this.angularSpeed, 0.09);

        this.rightArm = new RobotLeg(0.1, -this.angularSpeed, 0.09);

        this.robotBodywork = new RobotBodyWork(color);

    }

    move() {

        this.tx += this.speed;

        if (this.tx > 1.8 || this.tx < -1.8) {

            this.speed = -this.speed;

            this.angularSpeed = -this.angularSpeed;

            this.leftLeg.updateAngularSpeed(this.angularSpeed);

            this.rightLeg.updateAngularSpeed(this.angularSpeed);

            this.leftArm.updateAngularSpeed(-this.angularSpeed);

            this.rightArm.updateAngularSpeed(-this.angularSpeed);
        }

        const carTransform = m3.translation(this.tx, this.ty);

        this.robotBodywork.updateModelTransform(carTransform);

        this.leftLeg.updateRotation();
                this.leftLeg.updateModelTransform(carTransform);

        if (this.firsttime) {
            this.firsttime = false
            setTimeout(() => {
                this.rightLeg.updateRotation();
                this.rightLeg.updateModelTransform(carTransform);

            }, 5000);
        } else {
            this.rightLeg.updateRotation();
            this.rightLeg.updateModelTransform(carTransform);

        }
        this.leftArm.updateRotation();
        this.leftArm.updateModelTransform(carTransform);

        this.rightArm.updateRotation();
        this.rightArm.updateModelTransform(carTransform);

    }

    draw(renderer) {
        renderer.draw(this.leftLeg);

        renderer.draw(this.robotBodywork);
        if (this.firsttime) {
            this.firsttime = false
            setTimeout(() => {
                renderer.draw(this.rightLeg);


            }, 5000);
        } else {
            renderer.draw(this.rightLeg);

        }

        renderer.draw(this.leftArm);
        renderer.draw(this.rightArm);

    }
}


// ==================================================
// CLASSE SCENE
// ==================================================

class Scene {

    constructor(gl, program) {

        this.renderer = new Renderer(gl, program);

        this.viewTransform = m3.setClippingWindow(-2.0, -1.0, 2.0, 1.0);

        this.renderer.defineViewTransform(this.viewTransform);

        this.road = new Road();

        this.robots = [
            new Robot(0.5, 0.2, new Float32Array([1.0, 0.0, 0.0]), 0.003),
            new Robot(-1.2, 0.1, new Float32Array([0.0, 1, 0]), 0.005),
            new Robot(1.4, 0, new Float32Array([0, 0, 1.0]), -0.004),
            new Robot(-0.3, -0.2, new Float32Array([1.0, 1, 1]), 0.002),
        ];
    }

    update() {

        for (const robot of this.robots) {
            robot.move();
        }
    }

    draw() {

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        this.road.draw(this.renderer);

        for (const robot of this.robots) {
            robot.draw(this.renderer);
        }

    }

    execute() {

        this.update();

        this.draw();

        requestAnimationFrame(() => this.execute());
    }

    init() {

        requestAnimationFrame(() => this.execute());
    }
}


// ==================================================
// CONFIGURAÇÃO INICIAL DO WEBGL
// ==================================================

gl.clearColor(
    0.1,
    0.1,
    0.1,
    1.0
);

gl.viewport(
    0,
    0,
    canvas.width,
    canvas.height
);


// ==================================================
// CRIAR CENA
// ==================================================

const scene =
    new Scene(gl, program);


// ==================================================
// INICIAR ANIMAÇÃO
// ==================================================

scene.init();
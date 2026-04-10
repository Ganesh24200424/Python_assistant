import React, { useRef, useEffect } from 'react';

const vertexShader = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 projection;
  uniform mat4 view;
  uniform mat4 model;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vPos;
  void main() {
    vUv = uv;
    vPos = position;
    vec3 pos = position;
    pos.x += sin(pos.y * 2.0 + time) * 0.05;
    pos.y += cos(pos.x * 2.0 + time) * 0.05;
    gl_Position = projection * view * model * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vPos;
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  void main() {
    float dist = length(vUv - 0.5);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    float wave = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
    vec3 color = mix(colorA, colorB, wave);
    gl_FragColor = vec4(color, alpha * 0.6);
  }
`;

function Orbs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertexShader);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShader);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 0, 0, 0,
      1, -1, 0, 1, 0,
      1, 1, 0, 1, 1,
      -1, 1, 0, 0, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 20, 0);

    const timeLocation = gl.getUniformLocation(program, 'time');
    const colorALocation = gl.getUniformLocation(program, 'colorA');
    const colorBLocation = gl.getUniformLocation(program, 'colorB');

    gl.uniform3f(colorALocation, 0.486, 0.416, 0.937);
    gl.uniform3f(colorBLocation, 0.306, 0.804, 0.769);

    let startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;
      gl.uniform1f(timeLocation, time);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      requestAnimationFrame(render);
    };

    render();

    return () => {
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    />
  );
}

export default Orbs;
/* ---------------------------------------------------------------------------
   heat.js — the warm-air refraction field.

   Glutt's WebGL language is heat, not abstract tech graphics: the shimmer that
   sits above a hot pan. It renders its own warm ground and refracts it, so the
   distortion is always visible without compositing DOM through the canvas.

   Deliberately small: WebGL1, one fullscreen triangle, three octaves of value
   noise, DPR clamped to 1.5. No Three.js — a 600KB scene graph for a single
   full-screen pass would cost more than the effect is worth.
--------------------------------------------------------------------------- */

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uSource;   // heat origin (0..1)
uniform float uHeat;     // overall intensity
uniform vec2  uPointer;  // 0..1
uniform float uEnergy;   // pointer movement energy
uniform float uTone;     // 0 = warm night, 1 = kitchen warmth

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return v;
}

/* The ground the haze bends. Warm strata give refraction something to catch. */
vec3 ground(vec2 uv, vec2 asp){
  float d = distance(uv * asp, uSource * asp);
  float pool = exp(-d * d * 2.1);

  vec3 night = vec3(0.055, 0.046, 0.040);
  vec3 ember = mix(vec3(0.170, 0.120, 0.080), vec3(0.320, 0.205, 0.112), uTone);

  vec3 col = mix(night, ember, pool * (0.62 + 0.38 * uTone));

  /* A warm floor, so the objects read as standing in a room rather than
     floating in a void. */
  col += vec3(0.070, 0.046, 0.026) * smoothstep(0.55, 0.0, uv.y) * (0.45 + 0.55 * uTone);

  col += 0.013 * sin(uv.y * 52.0 + uTime * 0.10) * pool;
  col += 0.007 * sin(uv.x * 28.0 - uTime * 0.07) * (0.3 + pool);
  col *= 1.0 - 0.50 * pow(distance(uv, vec2(0.5)) * 1.24, 2.2);
  return col;
}

void main(){
  vec2 uv  = gl_FragCoord.xy / uRes;
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);

  /* Heat field: a column that rises off the source and thins as it climbs. */
  vec2  rel     = (uv - uSource) * asp;
  float lateral = exp(-rel.x * rel.x * 6.5);
  float above   = smoothstep(-0.07, 0.30, rel.y) * exp(-max(rel.y, 0.0) * 2.0);
  float field   = lateral * above;

  /* The pointer stirs the air a little. */
  float pd  = distance(uv * asp, uPointer * asp);
  float ptr = exp(-pd * pd * 24.0) * uEnergy;
  field = max(field, ptr * 0.8);

  float amp = field * uHeat * 0.030;

  float t = uTime * 0.16;
  vec2  q = vec2(uv.x * 7.0, uv.y * 4.2 - t * 1.35);
  float n1 = fbm(q);
  float n2 = fbm(q + vec2(3.7, -1.9));

  vec2 offset = vec2((n1 - 0.5) * 1.6, (n2 - 0.5) * 0.9) * amp;
  offset.x += (uPointer.x - uv.x) * ptr * 0.028;

  vec3 col = ground(uv + offset, asp);
  col += vec3(0.92, 0.63, 0.33) * field * uHeat * (n1 - 0.45) * 0.055;

  float g = hash(gl_FragCoord.xy + fract(uTime) * 97.0);
  col += (g - 0.5) * 0.016;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('[glutt/heat]', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/**
 * @returns {null | { render(state): void, resize(): void, dispose(): void }}
 *          null when WebGL is unavailable — callers fall back to the CSS ground.
 *          setQuality(q) scales the internal resolution for the load governor.
 */
export function createHeatField(canvas) {
  const gl =
    canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
    }) || canvas.getContext('experimental-webgl');

  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[glutt/heat]', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);

  // one oversized triangle beats a quad: fewer verts, no diagonal seam
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  for (const n of ['uRes', 'uTime', 'uSource', 'uHeat', 'uPointer', 'uEnergy', 'uTone'])
    U[n] = gl.getUniformLocation(prog, n);

  let w = 0;
  let h = 0;
  let quality = 0.85;

  /** Lower the internal resolution. The effect is a soft shimmer, so this is
      nearly invisible and is the cheapest thing to give up under load. */
  function setQuality(q) {
    quality = q;
    w = h = 0;
    resize();
  }

  function resize() {
    // 1.5 is plenty for a soft shimmer and roughly halves the fill cost on
    // a 3x phone screen; quality trims it further when frames get long.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
    const nw = Math.round(canvas.clientWidth * dpr);
    const nh = Math.round(canvas.clientHeight * dpr);
    if (nw === w && nh === h) return;
    w = canvas.width = nw;
    h = canvas.height = nh;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(U.uRes, w, h);
  }

  resize();

  function render({ time, source, heat, pointer, energy, tone }) {
    resize();
    gl.uniform1f(U.uTime, time);
    gl.uniform2f(U.uSource, source[0], source[1]);
    gl.uniform1f(U.uHeat, heat);
    gl.uniform2f(U.uPointer, pointer[0], pointer[1]);
    gl.uniform1f(U.uEnergy, energy);
    gl.uniform1f(U.uTone, tone);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function dispose() {
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.deleteBuffer(buf);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  return { render, resize, setQuality, dispose };
}

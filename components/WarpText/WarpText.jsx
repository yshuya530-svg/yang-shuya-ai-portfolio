"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import "./WarpText.css";

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `#version 300 es
precision highp float;
uniform sampler2D uTextTexture;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uTime;
uniform float uWarpStrength;
uniform float uWarpScale;
uniform float uSpeed;
uniform float uPointerInfluence;
uniform float uPointerStrength;
uniform float uRefraction;
uniform float uRipple;
uniform float uMotion;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }
  return value;
}

vec4 sampleText(vec2 uv) {
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
  return texture(uTextTexture, uv);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * uSpeed;
  float scale = max(uWarpScale, 0.001);
  vec2 drift = vec2(time * 0.055, -time * 0.045);
  float n1 = fbm(uv * scale * 3.1 + drift);
  float n2 = fbm((uv + 19.17) * scale * 3.4 - drift.yx);
  vec2 ambient = (vec2(n1, n2) - 0.5) * uWarpStrength * 0.045 * uMotion;

  vec2 pointerDelta = uv - uPointer;
  vec2 aspectDelta = vec2(pointerDelta.x * aspect, pointerDelta.y);
  float dist = length(aspectDelta);
  float radius = max(uPointerInfluence, 0.001);
  float t = clamp(dist / radius, 0.0, 1.0);
  float lens = smoothstep(radius, 0.0, dist) * uPointerActive;
  float bulge = t * (1.0 - t) * (1.0 - t) * 6.75 * uPointerActive;
  vec2 dir = dist > 0.0001 ? vec2(aspectDelta.x / aspect, aspectDelta.y) / dist : vec2(0.0);
  float rippleWave = sin(dist * 28.0 - time * 4.2) * 0.5 + 0.5;
  vec2 pointerWarp = -dir * bulge * uPointerStrength * 0.045;
  pointerWarp += dir * (rippleWave - 0.5) * uRipple * bulge * uPointerStrength * 0.016;

  vec2 displaced = uv + ambient + pointerWarp;
  vec2 splitDir = ambient + pointerWarp;
  float splitLen = length(splitDir);
  splitDir = splitLen > 0.00001 ? splitDir / splitLen : vec2(0.7071, 0.7071);
  vec2 split = splitDir * uRefraction * 0.16 * (0.35 + lens * 1.65);
  vec4 base = sampleText(displaced);
  float r = sampleText(displaced + split).r;
  float b = sampleText(displaced - split).b;
  float a = max(max(sampleText(displaced + split).a, base.a), sampleText(displaced - split).a);
  fragColor = vec4(vec3(r, base.g, b) + lens * base.a * 0.055, a);
}`;

const px = value => typeof value === "number" ? `${value}px` : value;

function measureLine(context, line, spacing) {
  const chars = Array.from(line);
  return chars.reduce((width, char) => width + context.measureText(char).width, 0)
    + Math.max(0, chars.length - 1) * spacing;
}

function drawLine(context, line, x, y, spacing) {
  const chars = Array.from(line);
  let cursor = x - measureLine(context, line, spacing) / 2;
  chars.forEach((char, index) => {
    context.fillText(char, cursor, y);
    cursor += context.measureText(char).width + (index === chars.length - 1 ? 0 : spacing);
  });
}

function buildTextCanvas(container, width, height, dpr, props) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width * dpr));
  canvas.height = Math.max(1, Math.floor(height * dpr));
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  const probe = document.createElement("span");
  probe.textContent = props.text;
  Object.assign(probe.style, {
    position: "absolute",
    visibility: "hidden",
    whiteSpace: "pre",
    fontFamily: props.fontFamily,
    fontSize: px(props.fontSize),
    fontWeight: String(props.fontWeight),
    letterSpacing: px(props.letterSpacing),
    lineHeight: String(props.lineHeight),
  });
  container.appendChild(probe);
  const computed = window.getComputedStyle(probe);
  let fontSize = parseFloat(computed.fontSize) || 96;
  let spacing = computed.letterSpacing === "normal" ? 0 : parseFloat(computed.letterSpacing) || 0;
  let lineHeight = parseFloat(computed.lineHeight);
  if (!Number.isFinite(lineHeight)) lineHeight = fontSize * Number(props.lineHeight || 0.9);
  const family = computed.fontFamily || "sans-serif";
  const weight = computed.fontWeight || String(props.fontWeight);
  probe.remove();

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillStyle = props.color;
  const lines = String(props.text || "").split("\n");
  const applyFont = () => { context.font = `${weight} ${fontSize}px ${family}`; };
  applyFont();
  const widest = Math.max(...lines.map(line => measureLine(context, line, spacing)), 1);
  const fit = Math.min(1, width * 0.92 / widest, height * 0.82 / Math.max(lineHeight * lines.length, 1));
  if (fit < 1) {
    fontSize *= fit;
    spacing *= fit;
    lineHeight *= fit;
    applyFont();
  }
  const startY = height / 2 - lineHeight * (lines.length - 1) / 2;
  lines.forEach((line, index) => drawLine(context, line, width / 2, startY + index * lineHeight, spacing));
  return canvas;
}

export default function WarpText({
  text = "Bend the moment",
  color = "#f8f5ff",
  warpStrength = 0.08,
  warpScale = 1.7,
  speed = 0.55,
  pointerInfluence = 0.42,
  pointerStrength = 0.38,
  refraction = 0.018,
  ripple = true,
  fontSize = "clamp(3rem, 10vw, 9rem)",
  fontWeight = 800,
  fontFamily = "inherit",
  letterSpacing = "-0.06em",
  lineHeight = 0.9,
  className = "",
  style,
}) {
  const containerRef = useRef(null);
  const propsRef = useRef({ text, color, fontSize, fontWeight, fontFamily, letterSpacing, lineHeight });
  const controlsRef = useRef(null);

  useEffect(() => {
    propsRef.current = { text, color, fontSize, fontWeight, fontFamily, letterSpacing, lineHeight };
    controlsRef.current?.rasterize();
  }, [text, color, fontSize, fontWeight, fontFamily, letterSpacing, lineHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let disposed = false;
    let frame = 0;
    let visible = true;
    let contextLost = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: false, antialias: true, dpr: Math.min(devicePixelRatio || 1, 2) });
    const { gl } = renderer;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    const texture = new Texture(gl, { generateMipmaps: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTextTexture: { value: texture },
        uResolution: { value: new Float32Array([1, 1]) },
        uPointer: { value: new Float32Array([0.5, 0.5]) },
        uPointerActive: { value: 0.18 },
        uTime: { value: 0 },
        uWarpStrength: { value: warpStrength },
        uWarpScale: { value: warpScale },
        uSpeed: { value: speed },
        uPointerInfluence: { value: pointerInfluence },
        uPointerStrength: { value: pointerStrength },
        uRefraction: { value: refraction },
        uRipple: { value: ripple ? 1 : 0 },
        uMotion: { value: reduceMotion ? 0 : 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: 0.18, target: 0.18 };
    const started = performance.now();

    const rasterize = async () => {
      try { await document.fonts?.ready; } catch {}
      if (disposed || contextLost) return;
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      texture.image = buildTextCanvas(container, rect.width, rect.height, Math.min(devicePixelRatio || 1, 2), propsRef.current);
      texture.needsUpdate = true;
    };
    controlsRef.current = { rasterize };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      rasterize();
    };
    const onMove = event => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (event.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (event.clientY - rect.top) / rect.height;
      pointer.target = 1;
    };
    const onLeave = () => { pointer.target = 0.18; };
    const onLost = event => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); };
    const loop = now => {
      if (disposed || contextLost) return;
      const elapsed = (now - started) * 0.001;
      const targetX = pointer.target > 0.2 ? pointer.tx : 0.5 + Math.sin(elapsed * 0.33) * 0.12;
      const targetY = pointer.target > 0.2 ? pointer.ty : 0.5 + Math.cos(elapsed * 0.27) * 0.1;
      pointer.x += (targetX - pointer.x) * (pointer.target > 0.2 ? 0.12 : 0.035);
      pointer.y += (targetY - pointer.y) * (pointer.target > 0.2 ? 0.12 : 0.035);
      pointer.active += (pointer.target - pointer.active) * 0.06;
      program.uniforms.uPointer.value[0] = pointer.x;
      program.uniforms.uPointer.value[1] = pointer.y;
      program.uniforms.uPointerActive.value = pointer.active;
      program.uniforms.uTime.value = reduceMotion ? 0 : elapsed;
      if (visible) renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibilityObserver.observe(container);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("webglcontextlost", onLost);
    resize();
    frame = requestAnimationFrame(loop);

    return () => {
      disposed = true;
      controlsRef.current = null;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (canvas.parentNode === container) container.removeChild(canvas);
      if (!contextLost) gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [pointerInfluence, pointerStrength, refraction, ripple, speed, warpScale, warpStrength]);

  return <div ref={containerRef} className={`warp-text ${className}`.trim()} style={style} role="img" aria-label={text} />;
}

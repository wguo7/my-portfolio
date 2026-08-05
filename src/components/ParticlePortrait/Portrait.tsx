"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const COUNT = 28000; // live points tracing the attractor
const SPAN = 300; // world-pixel size of the figure
const CAM_Z = 620;
const DWELL_SECONDS = 6; // how long each attractor holds its crisp form
const TRANSITION_SECONDS = 2; // dissolve-and-recrystallize into the next
const SEEDS = 8; // perturbed starting points; chaos spreads them across the attractor

// Genuinely 3D strange attractors — flows in 3-space, integrated forward.
const KINDS = ["lorenz", "thomas", "aizawa", "halvorsen"] as const;
const SEED_POINTS: Record<(typeof KINDS)[number], [number, number, number]> = {
  lorenz: [1, 1, 1],
  thomas: [0.1, 0.11, 0.09],
  aizawa: [0.1, 0, 0],
  halvorsen: [-1.48, -1.51, 2.04],
};

// module-level scratch: reused across traces, zero allocation per call
const scratchX = new Float64Array(COUNT);
const scratchY = new Float64Array(COUNT);
const scratchZ = new Float64Array(COUNT);

/** Integrate the flow from several perturbed seeds; write normalized xyz into `out`. */
function traceShape(kindIdx: number, out: Float32Array) {
  const kind = KINDS[kindIdx % KINDS.length];
  const seed = SEED_POINTS[kind];
  const per = Math.floor(COUNT / SEEDS);
  const burnIn = 500;
  let idx = 0;

  for (let s = 0; s < SEEDS; s++) {
    let x = seed[0] + (Math.random() - 0.5) * 0.1;
    let y = seed[1] + (Math.random() - 0.5) * 0.1;
    let z = seed[2] + (Math.random() - 0.5) * 0.1;
    const n = s === SEEDS - 1 ? COUNT - per * (SEEDS - 1) : per;

    for (let i = 0; i < n + burnIn; i++) {
      let nx: number, ny: number, nz: number;
      if (kind === "lorenz") {
        const dt = 0.005;
        nx = x + 10 * (y - x) * dt;
        ny = y + (x * (28 - z) - y) * dt;
        nz = z + (x * y - (8 / 3) * z) * dt;
      } else if (kind === "thomas") {
        const dt = 0.2;
        const b = 0.208186;
        nx = x + (Math.sin(y) - b * x) * dt;
        ny = y + (Math.sin(z) - b * y) * dt;
        nz = z + (Math.sin(x) - b * z) * dt;
      } else if (kind === "aizawa") {
        const dt = 0.01;
        nx = x + ((z - 0.7) * x - 3.5 * y) * dt;
        ny = y + (3.5 * x + (z - 0.7) * y) * dt;
        nz =
          z +
          (0.6 +
            0.95 * z -
            (z * z * z) / 3 -
            (x * x + y * y) * (1 + 0.25 * z) +
            0.1 * z * x * x * x) *
            dt;
      } else {
        const dt = 0.01;
        const a = 1.89;
        nx = x + (-a * x - 4 * y - 4 * z - y * y) * dt;
        ny = y + (-a * y - 4 * z - 4 * x - z * z) * dt;
        nz = z + (-a * z - 4 * x - 4 * y - x * x) * dt;
      }
      x = nx;
      y = ny;
      z = nz;
      if (i >= burnIn) {
        scratchX[idx] = x;
        scratchY[idx] = y;
        scratchZ[idx] = z;
        idx++;
      }
    }
  }

  let x0 = Infinity,
    x1 = -Infinity,
    y0 = Infinity,
    y1 = -Infinity,
    z0 = Infinity,
    z1 = -Infinity;
  for (let i = 0; i < COUNT; i++) {
    if (scratchX[i] < x0) x0 = scratchX[i];
    if (scratchX[i] > x1) x1 = scratchX[i];
    if (scratchY[i] < y0) y0 = scratchY[i];
    if (scratchY[i] > y1) y1 = scratchY[i];
    if (scratchZ[i] < z0) z0 = scratchZ[i];
    if (scratchZ[i] > z1) z1 = scratchZ[i];
  }
  const span = Math.max(x1 - x0, y1 - y0, z1 - z0) || 1;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const cz = (z0 + z1) / 2;

  for (let i = 0; i < COUNT; i++) {
    out[i * 3] = ((scratchX[i] - cx) / span) * SPAN;
    out[i * 3 + 1] = ((scratchY[i] - cy) / span) * SPAN;
    out[i * 3 + 2] = ((scratchZ[i] - cz) / span) * SPAN;
  }
}

// r3f raycasts pointer events against the scene; opting the point cloud out
// saves per-mousemove CPU (20k points is a lot to hit-test for nothing)
const noRaycast = () => null;

/** Run `fn` when the main thread is idle (falls back to a short timeout). */
function whenIdle(fn: () => void): void {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    (window as Window).requestIdleCallback(() => fn(), { timeout: 2000 });
  } else {
    setTimeout(fn, 300);
  }
}

const vertexShader = /* glsl */ `
  attribute vec3 aNext;
  attribute vec3 aScatter;
  attribute float aBright;
  attribute float aRand;
  uniform float uProgress;
  uniform float uMorph;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uStrength;
  uniform float uDpr;
  uniform float uScale;
  uniform float uCamZ;
  varying float vMix;
  varying float vBright;
  varying float vDepth;

  void main() {
    // dissolve between attractors, each point on its own slight schedule
    float m = clamp((uMorph - aRand * 0.25) / 0.75, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 shape = mix(position, aNext, m);

    // entrance: assemble from scatter
    float t = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 pos = mix(aScatter, shape, t);

    // idle drift
    pos.x += sin(uTime * 0.7 + aRand * 6.283) * 1.6 * t;
    pos.y += cos(uTime * 0.6 + aRand * 6.283) * 1.6 * t;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // cursor: repel in view space, so it works at any 3D rotation
    vec2 diff = mv.xy - uMouse;
    float d = length(diff);
    float n = smoothstep(70.0 * uScale, 0.0, d) * t * uStrength;
    vec2 dir = diff / max(d, 0.001);
    vec2 tangent = vec2(-dir.y, dir.x) * (aRand - 0.5) * 2.0;
    mv.xy += (dir + tangent) * n * (26.0 + 22.0 * aRand) * uScale;
    mv.x += sin(uTime * 2.2 + aRand * 6.283) * 3.0 * n * uScale;
    mv.y += cos(uTime * 1.9 + aRand * 6.283) * 3.0 * n * uScale;

    vMix = n;
    vBright = aBright;

    gl_Position = projectionMatrix * mv;

    // perspective: nearer points render larger and brighter
    float att = uCamZ / max(1.0, -mv.z);
    vDepth = att;
    // finer points, more of them: etched-line quality rather than dust
    gl_PointSize = (1.05 + 1.15 * aBright) * (1.0 + 0.6 * n) * uScale * uDpr * att;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uMono;
  varying float vMix;
  varying float vBright;
  varying float vDepth;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.2, r);
    float depthFade = 0.55 + 0.45 * smoothstep(0.75, 1.2, vDepth);
    a *= (0.38 + 0.5 * vBright) * depthFade * (1.0 + 0.8 * vMix);
    if (a < 0.01) discard;
    gl_FragColor = vec4(uMono, min(a, 1.0));
  }
`;

function Points({ dark }: { dark: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const progress = useRef(0);
  const morph = useRef(0);
  const shapeIdx = useRef(0);
  const strength = useRef(0);
  const over = useRef(false);
  const pending = useRef<Float32Array | null>(null);
  const pendingReady = useRef(false);
  const mouseTarget = useRef(new THREE.Vector2());
  const lastDark = useRef<boolean | null>(null);
  const perf = useRef({ warmup: 0, ema: 16, tier: 0 });
  const viewport = useThree((s) => s.viewport);
  const dpr = useThree((s) => s.gl.getPixelRatio());
  const domElement = useThree((s) => s.gl.domElement);
  const setDpr = useThree((s) => s.setDpr);

  const { geometry, baseRotation } = useMemo(() => {
    const start = Math.floor(Math.random() * KINDS.length);
    shapeIdx.current = start;

    const from = new Float32Array(COUNT * 3);
    const to = new Float32Array(COUNT * 3);
    traceShape(start, from);
    traceShape(start + 1, to);
    pending.current = new Float32Array(COUNT * 3);
    pendingReady.current = false;

    const scatter = new Float32Array(COUNT * 3);
    const bright = new Float32Array(COUNT);
    const rand = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = SPAN * (0.7 + Math.random() * 0.9);
      scatter[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      scatter[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      scatter[i * 3 + 2] = radius * Math.cos(phi);
      bright[i] = Math.random();
      rand[i] = Math.random();
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(from, 3));
    g.setAttribute("aNext", new THREE.BufferAttribute(to, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    g.setAttribute("aBright", new THREE.BufferAttribute(bright, 1));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return {
      geometry: g,
      baseRotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // precompute the shape after next during the calm dwell period
  useEffect(() => {
    whenIdle(() => {
      if (!pending.current) return;
      traceShape(shapeIdx.current + 2, pending.current);
      pendingReady.current = true;
    });
  }, [geometry]);

  // r3f's pointer defaults to the canvas center before any movement, so track
  // actual presence ourselves and fade the effect in/out instead
  useEffect(() => {
    const enter = () => (over.current = true);
    const leave = () => (over.current = false);
    const burst = () => (progress.current = 0); // click: scatter + reassemble
    domElement.addEventListener("pointermove", enter);
    domElement.addEventListener("pointerleave", leave);
    domElement.addEventListener("pointerdown", burst);
    return () => {
      domElement.removeEventListener("pointermove", enter);
      domElement.removeEventListener("pointerleave", leave);
      domElement.removeEventListener("pointerdown", burst);
    };
  }, [domElement]);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uStrength: { value: 0 },
      uMono: { value: new THREE.Color("#EDEDEC") },
      uDpr: { value: 1 },
      uScale: { value: 1 },
      uCamZ: { value: CAM_Z },
    }),
    [],
  );

  // the canvas is oversized so scattered points can fly past the figure;
  // divide by 1.5 to keep the figure at its intended visual size
  const scale = Math.min(viewport.width, viewport.height) / (SPAN * 1.5);

  useFrame((state, delta) => {
    if (!material.current || !pointsRef.current) return;
    progress.current = Math.min(progress.current + delta / 1.8, 1);

    // adaptive quality: if this machine can't hold ~45fps, degrade gracefully
    const p = perf.current;
    p.warmup += delta;
    if (p.warmup > 4 && delta < 0.5) {
      p.ema = p.ema * 0.95 + delta * 1000 * 0.05;
      if (p.ema > 22 && p.tier === 0) {
        p.tier = 1;
        p.ema = 16;
        setDpr(1); // drop resolution first
      } else if (p.ema > 22 && p.tier === 1) {
        p.tier = 2;
        p.ema = 16;
        geometry.setDrawRange(0, COUNT / 2); // then halve the points
      }
    }

    // dwell crisp, then dissolve into the next attractor
    morph.current += delta;
    let uMorphValue =
      morph.current < DWELL_SECONDS
        ? 0
        : Math.min((morph.current - DWELL_SECONDS) / TRANSITION_SECONDS, 1);
    if (morph.current >= DWELL_SECONDS + TRANSITION_SECONDS) {
      if (pendingReady.current && pending.current) {
        // swap = two memcpys; the expensive trace already ran during dwell.
        // uMorph must render 0 on THIS frame — the swapped buffers land in the
        // same render, and 1 would flash the shape-after-next for one frame.
        morph.current = 0;
        uMorphValue = 0;
        shapeIdx.current += 1;
        const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
        const next = geometry.getAttribute("aNext") as THREE.BufferAttribute;
        (pos.array as Float32Array).set(next.array as Float32Array);
        (next.array as Float32Array).set(pending.current);
        pos.needsUpdate = true;
        next.needsUpdate = true;
        pendingReady.current = false;
        whenIdle(() => {
          if (!pending.current) return;
          traceShape(shapeIdx.current + 2, pending.current);
          pendingReady.current = true;
        });
      }
      // else: hold at uMorph=1 (fully formed as aNext) until the trace is ready
    }

    // slow 3D tumble
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.set(
      baseRotation.x + Math.sin(t * 0.11) * 0.4,
      baseRotation.y + t * 0.14,
      baseRotation.z + Math.sin(t * 0.07) * 0.2,
    );

    const u = material.current.uniforms;
    u.uProgress.value = progress.current;
    u.uMorph.value = uMorphValue;
    u.uTime.value = t;
    u.uDpr.value = dpr;
    u.uScale.value = scale;
    if (lastDark.current !== dark) {
      lastDark.current = dark;
      u.uMono.value.set(dark ? "#EDEDEC" : "#111110");
    }

    // fade the disturbance in while the pointer is over, out when it leaves
    const target = over.current ? 1 : 0;
    strength.current += (target - strength.current) * Math.min(delta * 6, 1);
    u.uStrength.value = strength.current;

    // pointer NDC -> view-space px at the focal plane
    if (over.current) {
      const px = (state.pointer.x * viewport.width) / 2;
      const py = (state.pointer.y * viewport.height) / 2;
      if (strength.current < 0.02) {
        u.uMouse.value.set(px, py); // snap on entry, no cross-canvas sweep
      } else {
        mouseTarget.current.set(px, py);
        u.uMouse.value.lerp(mouseTarget.current, 0.25);
      }
    }
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      frustumCulled={false}
      raycast={noRaycast}
      scale={[scale, scale, scale]}
    >
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </points>
  );
}

export default function Portrait() {
  const [active, setActive] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // pause rendering when scrolled out of view
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={container} className="h-full w-full" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, CAM_Z], fov: 36 }}
        gl={{
          antialias: false,
          alpha: true,
          depth: false,
          stencil: false,
          powerPreference: "low-power",
        }}
        style={{ background: "transparent" }}
      >
        <Points dark={resolvedTheme !== "light"} />
      </Canvas>
    </div>
  );
}

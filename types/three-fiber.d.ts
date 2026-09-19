import type { ThreeElements } from '@react-three/fiber'

// ─── React Three Fiber JSX type augmentation ──────────────────────────────────
//
// Extends JSX.IntrinsicElements with all Three.js/R3F elements:
// <mesh>, <group>, <lineSegments>, <pointLight>, <ambientLight>, etc.
//
// This must be a module (not a script) — hence the `export {}`.
// Required for TypeScript to accept R3F JSX in strict mode.
// See: https://docs.pmnd.rs/react-three-fiber/tutorials/typescript

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

export {}

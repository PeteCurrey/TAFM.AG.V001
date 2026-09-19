// @ts-nocheck — R3F JSX elements (group, mesh, lineSegments etc.) use a custom reconciler.
// TypeScript cannot resolve these via JSX.IntrinsicElements in Next.js 15 / React 19.
'use client'


import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

// ─── Hero geometric form ──────────────────────────────────────────────────────
//
// An abstract architectural geometric composition.
// Reads as: precision engineering, industrial asset intelligence.
// NOT: spinning cube, AI tech blob, crypto token.

function HeroGeometry() {
  const groupRef = useRef<THREE.Group>(null)
  const reducedMotion = useReducedMotion()
  const { pointer } = useThree()

  // Primary form: a large slightly-flattened octahedron — structural, dimensional
  const primaryGeometry = useMemo(() => new THREE.OctahedronGeometry(1.6, 3), [])
  const primaryMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0D0C0B'),
        metalness: 0.85,
        roughness: 0.15,
        envMapIntensity: 1.2,
      }),
    [],
  )

  // Edge wireframe: orange precision lines
  const edgeGeometry = useMemo(() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.6, 1)), [])
  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#FF6A1A'),
        transparent: true,
        opacity: 0.6,
      }),
    [],
  )

  // Secondary form: smaller offset octahedron for depth
  const secondaryGeometry = useMemo(() => new THREE.OctahedronGeometry(0.85, 2), [])
  const secondaryMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#0A0908'),
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1,
        transparent: true,
        opacity: 0.7,
      }),
    [],
  )

  // Secondary edges
  const secondaryEdgeGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.85, 1)),
    [],
  )
  const secondaryEdgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color('#FF8C42'),
        transparent: true,
        opacity: 0.35,
      }),
    [],
  )

  // Target rotation for pointer-following
  const targetRotation = useRef({ x: -0.1, y: 0.2 })
  const currentRotation = useRef({ x: -0.1, y: 0.2 })

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return

    // Update target from pointer position
    targetRotation.current.x = -pointer.y * 0.3 - 0.1
    targetRotation.current.y = pointer.x * 0.4 + 0.2

    // Smooth lerp towards target (precision control — not jittery)
    const lerpFactor = 1 - Math.pow(0.02, delta)
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor

    // Slow continuous base rotation
    currentRotation.current.y += delta * 0.08

    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y
  })

  return (
    <group ref={groupRef}>
      {/* Primary form */}
      <mesh geometry={primaryGeometry} material={primaryMaterial} />
      <lineSegments geometry={edgeGeometry} material={edgeMaterial} />

      {/* Secondary offset form — depth and complexity */}
      <mesh
        geometry={secondaryGeometry}
        material={secondaryMaterial}
        position={[0.9, -0.5, 0.3]}
        rotation={[0.4, 0.8, 0.2]}
      />
      <lineSegments
        geometry={secondaryEdgeGeometry}
        material={secondaryEdgeMaterial}
        position={[0.9, -0.5, 0.3]}
        rotation={[0.4, 0.8, 0.2]}
      />
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene() {
  return (
    <>
      {/* Atmospheric lighting */}
      <ambientLight intensity={0.08} color="#1a1510" />

      {/* Primary orange-tinted key light */}
      <pointLight
        position={[-3.5, 3, 2]}
        intensity={120}
        color="#FF7030"
        decay={2}
      />

      {/* Cool fill light from right */}
      <pointLight
        position={[4, -1, 3]}
        intensity={20}
        color="#a0b8d0"
        decay={2}
      />

      {/* Subtle back light for depth */}
      <pointLight
        position={[0, -3, -3]}
        intensity={10}
        color="#0a0a14"
        decay={2}
      />

      <Environment preset="night" />

      <HeroGeometry />

      {/* Bloom post-processing — glow on orange edges */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.4}
          luminanceSmoothing={0.6}
          intensity={0.8}
          radius={0.7}
        />
      </EffectComposer>
    </>
  )
}

// ─── Hero visual canvas ───────────────────────────────────────────────────────

interface HeroVisualProps {
  className?: string
}

export function HeroVisual({ className }: HeroVisualProps) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}

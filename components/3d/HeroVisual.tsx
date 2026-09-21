'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'

// ─── Hero visual canvas (Vanilla Three.js) ───────────────────────────────────
//
// An abstract architectural geometric composition.
// Reads as: precision engineering, industrial asset intelligence.
// Built with vanilla Three.js for direct WebGL control and seamless React 19 support.
//
// NOT: spinning cube, AI tech blob, crypto token.

interface HeroVisualProps {
  className?: string
}

export function HeroVisual({ className }: HeroVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // ─── Scene & Camera Setup ───────────────────────────────────────────────
    const scene = new THREE.Scene()
    const width = container.clientWidth || 600
    const height = container.clientHeight || 600

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // ─── Lighting ───────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x1a1510, 0.6)
    scene.add(ambientLight)

    const primaryOrangeLight = new THREE.PointLight(0xFF7030, 80, 20, 1.5)
    primaryOrangeLight.position.set(-3.5, 3, 2)
    scene.add(primaryOrangeLight)

    const coolFillLight = new THREE.PointLight(0xa0b8d0, 25, 20, 1.5)
    coolFillLight.position.set(4, -1, 3)
    scene.add(coolFillLight)

    const subtleBackLight = new THREE.PointLight(0x0a0a14, 15, 20, 1.5)
    subtleBackLight.position.set(0, -3, -3)
    scene.add(subtleBackLight)

    // ─── Geometries & Materials ─────────────────────────────────────────────
    const group = new THREE.Group()

    // Primary form: structural octahedron
    const primaryGeometry = new THREE.OctahedronGeometry(1.6, 3)
    const primaryMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0D0C0B,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 0.2,
    })
    const primaryMesh = new THREE.Mesh(primaryGeometry, primaryMaterial)
    group.add(primaryMesh)

    // Primary wireframe edges: orange precision accent
    const edgeGeometry = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.6, 1))
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xFF6A1A,
      transparent: true,
      opacity: 0.65,
    })
    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial)
    group.add(edgeLines)

    // Secondary offset form: dimensional depth
    const secondaryGeometry = new THREE.OctahedronGeometry(0.85, 2)
    const secondaryMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0A0908,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    })
    const secondaryMesh = new THREE.Mesh(secondaryGeometry, secondaryMaterial)
    secondaryMesh.position.set(0.9, -0.5, 0.3)
    secondaryMesh.rotation.set(0.4, 0.8, 0.2)
    group.add(secondaryMesh)

    // Secondary edges
    const secondaryEdgeGeometry = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.85, 1))
    const secondaryEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0xFF8C42,
      transparent: true,
      opacity: 0.35,
    })
    const secondaryEdgeLines = new THREE.LineSegments(secondaryEdgeGeometry, secondaryEdgeMaterial)
    secondaryEdgeLines.position.set(0.9, -0.5, 0.3)
    secondaryEdgeLines.rotation.set(0.4, 0.8, 0.2)
    group.add(secondaryEdgeLines)

    scene.add(group)

    // ─── Rotation & Pointer Tracking ────────────────────────────────────────
    let targetRotationX = -0.1
    let targetRotationY = 0.2
    let currentRotationX = -0.1
    let currentRotationY = 0.2

    const handlePointerMove = (event: MouseEvent) => {
      if (reducedMotion) return
      const pointerX = (event.clientX / window.innerWidth) * 2 - 1
      const pointerY = -(event.clientY / window.innerHeight) * 2 + 1
      targetRotationX = -pointerY * 0.3 - 0.1
      targetRotationY = pointerX * 0.4 + 0.2
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })

    // ─── Animation Loop ─────────────────────────────────────────────────────
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      if (!reducedMotion) {
        currentRotationX += (targetRotationX - currentRotationX) * 0.04
        currentRotationY += (targetRotationY - currentRotationY) * 0.04
        currentRotationY += 0.001 // Slow continuous base rotation
      }

      group.rotation.x = currentRotationX
      group.rotation.y = currentRotationY

      renderer.render(scene, camera)
    }

    animate()

    // ─── Resize Handling ────────────────────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect
        if (newWidth === 0 || newHeight === 0) continue
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }
    })

    resizeObserver.observe(container)

    // ─── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handlePointerMove)
      resizeObserver.disconnect()

      primaryGeometry.dispose()
      primaryMaterial.dispose()
      edgeGeometry.dispose()
      edgeMaterial.dispose()

      secondaryGeometry.dispose()
      secondaryMaterial.dispose()
      secondaryEdgeGeometry.dispose()
      secondaryEdgeMaterial.dispose()

      renderer.dispose()
    }
  }, [reducedMotion])

  return (
    <div ref={containerRef} className={className ?? 'w-full h-full min-h-[500px] flex items-center justify-center'} aria-hidden="true">
      <canvas ref={canvasRef} className="w-full h-full max-w-full max-h-full block" />
    </div>
  )
}

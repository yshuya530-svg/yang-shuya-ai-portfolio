"use client";
/* eslint-disable react/no-unknown-property, @typescript-eslint/no-explicit-any, react-hooks/immutability, @next/next/no-img-element */

import { Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./Lanyard.css";

type Props = {
  frontImage: string;
  backImage?: string;
  onActivate?: () => void;
};

const BLANK_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

export default function Lanyard({ frontImage, backImage, onActivate }: Props) {
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const update = () => setMobile(window.innerWidth < 720);
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      update();
    });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className={`lanyard-wrapper${ready ? " is-ready" : ""}`} aria-label="可拖动的 Shay 照片吊牌">
      <div className="lanyard-poster" aria-hidden="true">
        <span className="lanyard-poster__strap" />
        <span className="lanyard-poster__card"><img src={frontImage} alt="" loading="eager" fetchPriority="high" /></span>
      </div>
      {mounted && (
        <Canvas
          camera={{ position: [0, 0, mobile ? 13 : 11], fov: 25 }}
          dpr={mobile ? 2 : [1, 1.7]}
          flat
          gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.setClearColor(new THREE.Color(0x000000), 0);
          }}
        >
          <ambientLight intensity={Math.PI} />
          <Physics gravity={[0, -38, 0]} timeStep={mobile ? 1 / 30 : 1 / 60}>
            <Band mobile={mobile} frontImage={frontImage} backImage={backImage} onActivate={onActivate} onReady={markReady} />
          </Physics>
          <Environment blur={0.78}>
            <Lightformer intensity={2.5} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, .1, 1]} />
            <Lightformer intensity={3} color="#eee5da" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, .1, 1]} />
            <Lightformer intensity={7} color="#d16a50" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          </Environment>
        </Canvas>
      )}
      <p className="lanyard-hint"><b>拖动吊牌</b><span>松手直达项目 ↓</span></p>
    </div>
  );
}

type BandProps = {
  mobile: boolean;
  frontImage: string;
  backImage?: string;
  onActivate?: () => void;
  onReady: () => void;
};

function Band({ mobile, frontImage, backImage, onActivate, onReady }: BandProps) {
  const band = useRef<THREE.Mesh>(null);
  const fixed = useRef<any>(null);
  const joint1 = useRef<any>(null);
  const joint2 = useRef<any>(null);
  const joint3 = useRef<any>(null);
  const card = useRef<any>(null);
  const vector = useMemo(() => new THREE.Vector3(), []);
  const angular = useMemo(() => new THREE.Vector3(), []);
  const rotation = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
    [],
  );
  const lineGeometry = useMemo(() => new MeshLineGeometry(), []);

  const gltf = useGLTF("/reactbits/card.glb") as any;
  const strapTexture = useTexture("/reactbits/lanyard.png");
  const frontTexture = useTexture(frontImage || BLANK_PIXEL);
  const backTexture = useTexture(backImage || BLANK_PIXEL);
  const lineMaterial = useMemo(
    () => new MeshLineMaterial({
      color: "white",
      depthTest: false,
      resolution: new THREE.Vector2(1000, mobile ? 2000 : 1000),
      useMap: 1,
      map: strapTexture,
      repeat: new THREE.Vector2(-4, 1),
      lineWidth: .9,
    }),
    [mobile, strapTexture],
  );

  const cardMap = useMemo(() => {
    const baseMap = gltf.materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;
    const canvas = document.createElement("canvas");
    canvas.width = (baseMap.image as { width: number }).width;
    canvas.height = (baseMap.image as { height: number }).height;
    const context = canvas.getContext("2d");
    if (!context) return baseMap;
    context.fillStyle = "#eee8df";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const drawContained = (source: HTMLImageElement, rect: typeof FRONT_UV_RECT) => {
      const x = rect.x * canvas.width;
      const y = rect.y * canvas.height;
      const width = rect.w * canvas.width;
      const height = rect.h * canvas.height;
      const scale = Math.min(width / source.width, height / source.height);
      const drawWidth = source.width * scale;
      const drawHeight = source.height * scale;
      context.save();
      context.beginPath();
      context.rect(x, y, width, height);
      context.clip();
      context.fillStyle = "#eee8df";
      context.fillRect(x, y, width, height);
      context.drawImage(source, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
      context.restore();
    };

    if (frontTexture.image) drawContained(frontTexture.image as HTMLImageElement, FRONT_UV_RECT);
    if (backImage && backTexture.image) drawContained(backTexture.image as HTMLImageElement, BACK_UV_RECT);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = baseMap.flipY;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
    return texture;
  }, [backImage, backTexture.image, frontImage, frontTexture.image, gltf.materials.base.map]);

  useEffect(() => {
    onReady();
  }, [cardMap, onReady]);

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);
  const segmentProps = { canSleep: true, colliders: false as const, angularDamping: 4, linearDamping: 4 };
  const ropeSegment = mobile ? .78 : 1;

  useRopeJoint(fixed, joint1, [[0, 0, 0], [0, 0, 0], ropeSegment]);
  useRopeJoint(joint1, joint2, [[0, 0, 0], [0, 0, 0], ropeSegment]);
  useRopeJoint(joint2, joint3, [[0, 0, 0], [0, 0, 0], ropeSegment]);
  useSphericalJoint(joint3, card, [[0, 0, 0], [0, 1.5, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => { document.body.style.cursor = "auto"; };
  }, [dragged, hovered]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vector.set(state.pointer.x, state.pointer.y, .5).unproject(state.camera);
      direction.copy(vector).sub(state.camera.position).normalize();
      vector.add(direction.multiplyScalar(state.camera.position.length()));
      [card, joint1, joint2, joint3, fixed].forEach((reference) => reference.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vector.x - dragged.x,
        y: vector.y - dragged.y,
        z: vector.z - dragged.z,
      });
    }

    if (!fixed.current || !joint1.current || !joint2.current || !joint3.current || !card.current || !band.current) return;
    const translations = [
      joint3.current.translation(),
      joint2.current.translation(),
      joint1.current.translation(),
      fixed.current.translation(),
    ];
    const allFinite = translations.every((point) =>
      Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z));
    if (!allFinite) return;

    [joint1, joint2].forEach((reference) => {
      const current = reference.current.translation();
      const lerped = reference.current.lerped as THREE.Vector3 | undefined;
      if (!lerped || !Number.isFinite(lerped.x) || !Number.isFinite(lerped.y) || !Number.isFinite(lerped.z)) {
        reference.current.lerped = new THREE.Vector3().copy(current);
      }
      const distance = Math.max(.1, Math.min(1, reference.current.lerped.distanceTo(current)));
      reference.current.lerped.lerp(current, delta * distance * 50);
    });
    curve.points[0].copy(translations[0]);
    curve.points[1].copy(joint2.current.lerped);
    curve.points[2].copy(joint1.current.lerped);
    curve.points[3].copy(translations[3]);
    (band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(mobile ? 16 : 32));
    angular.copy(card.current.angvel());
    rotation.copy(card.current.rotation());
    card.current.setAngvel({ x: angular.x, y: angular.y - rotation.y * .25, z: angular.z });
  });

  curve.curveType = "chordal";
  strapTexture.wrapS = strapTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[.5, 0, 0]} ref={joint1} {...segmentProps}><BallCollider args={[.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={joint2} {...segmentProps}><BallCollider args={[.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={joint3} {...segmentProps}><BallCollider args={[.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[.9, 1.265, .01]} />
          <group
            scale={2.5}
            position={[0, -1.2, -.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(event) => {
              event.currentTarget.releasePointerCapture(event.pointerId);
              const shouldActivate = Boolean(dragged);
              setDragged(false);
              if (shouldActivate) window.setTimeout(() => onActivate?.(), 180);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragged(new THREE.Vector3().copy(event.point).sub(vector.copy(card.current.translation())));
            }}
          >
            <mesh geometry={gltf.nodes.card.geometry}>
              <meshBasicMaterial map={cardMap} toneMapped={false} />
            </mesh>
            <mesh geometry={gltf.nodes.clip.geometry} material={gltf.materials.metal} />
            <mesh geometry={gltf.nodes.clamp.geometry} material={gltf.materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} position={[0, 0, -.12]} renderOrder={1}>
        <primitive object={lineGeometry} attach="geometry" />
        <primitive object={lineMaterial} attach="material" />
      </mesh>
    </>
  );
}

useGLTF.preload("/reactbits/card.glb");

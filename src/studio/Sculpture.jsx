import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createModel } from './models';

export default function Sculpture({ exploded, paused, variant = 'tower', rotation = 0 }) {
  const host = useRef(null);
  const state = useRef({ exploded, paused, rotation });
  useEffect(() => { state.current = { exploded, paused, rotation }; }, [exploded, paused, rotation]);
  useEffect(() => {
    const container = host.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { container.dataset.fallback = 'true'; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    camera.position.set(5, 3, 9);
    camera.lookAt(0, 0, 0);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, .04);
    scene.environment = environment.texture;
    room.dispose();
    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const model = createModel(variant, sculpture);
    const light = new THREE.PointLight('#e5ff86', 25, 20);
    light.position.set(3, 4, 3); scene.add(light);
    const violet = new THREE.PointLight('#e32eff', 25, 20);
    violet.position.set(-4, -2, 2); scene.add(violet);
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(180 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = Math.sin(i * 127.1 + 31.7) * 7;
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({ color: '#c4a0ff', size: .025, transparent: true, opacity: .7 });
    const points = new THREE.Points(pointsGeometry, pointsMaterial); scene.add(points);
    const pointer = { x: 0, y: 0 };
    const move = e => { const b = container.getBoundingClientRect(); pointer.x = (e.clientX-b.left)/b.width-.5; pointer.y = (e.clientY-b.top)/b.height-.5; };
    const leave = () => { pointer.x = 0; pointer.y = 0; };
    container.addEventListener('pointermove', move); container.addEventListener('pointerleave', leave);
    let staticState = '';
    const resize = new ResizeObserver(() => { const { width, height } = container.getBoundingClientRect(); renderer.setSize(width, height); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); staticState = ''; });
    resize.observe(container);
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); observer.observe(container);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let time = 0, spread = 0, frame = 0, lastRendered = 0;
    const render = now => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      const still = state.current.paused || reduced.matches;
      const size = `${container.clientWidth}:${container.clientHeight}:${state.current.exploded}:${state.current.rotation}`;
      if (still && staticState === size) return;
      if (!still && now - lastRendered < 1000 / 30) return;
      const delta = Math.min((now - lastRendered) / 1000, .05);
      lastRendered = now;
      staticState = still ? size : '';
      if (!still) time += delta;
      spread = still ? Number(state.current.exploded) : THREE.MathUtils.lerp(spread, Number(state.current.exploded), .055);
      sculpture.rotation.y = time * .15 + state.current.rotation * Math.PI / 180 + (still ? 0 : pointer.x * .65);
      sculpture.rotation.z = -.15;
      sculpture.rotation.x = still ? 0 : pointer.y * .12;
      model.update(time, spread);
      sculpture.position.y = Math.sin(time * .8) * .1;
      points.rotation.y = time * .018;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      container.removeEventListener('pointermove', move); container.removeEventListener('pointerleave', leave);
      model.dispose(); pointsGeometry.dispose(); pointsMaterial.dispose(); environment.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, [variant]);
  return <div className="sculpture-canvas" data-model={variant} ref={host} aria-hidden="true"><div className="sculpture-fallback">{variant === 'reactor' ? '◈' : variant === 'bloom' ? '✳' : 'V'}<span>/</span></div></div>;
}

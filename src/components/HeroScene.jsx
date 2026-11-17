import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/*
  Hero background (three.js): floating photo-frames (square) and signature strips (3.75 : 1)
  drifting among soft dots. Follows the pointer a little, pauses when off-screen,
  re-colours itself when day/night flips, and never throws if WebGL is missing.
*/
const rgbVar = (name) => {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim().split(/\s+/).map(Number);
  return new THREE.Color((v[0] || 0) / 255, (v[1] || 0) / 255, (v[2] || 0) / 255);
};

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export default function HeroScene({ className = '' }) {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return undefined;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return undefined; // WebGL নেই: ব্যাকগ্রাউন্ড ছাড়াই চলবে
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.set(0, 0, 9);

    const brand = rgbVar('--brand');
    const accent = rgbVar('--accent');
    const mats = [];
    const geos = [];
    const cards = [];
    const layout = [
      [-6.2, 2.6, -2, 1.1, 0], [5.8, 3, -3, 3.75 * 0.55, 1], [6.6, -0.4, -1, 1.5, 0], [-5.2, -2.8, -1.5, 3.75 * 0.6, 1],
      [2.2, -3.4, -3, 1.2, 0], [-1.8, 3.6, -4, 1, 0], [0.4, 0.2, -6, 1.8, 0], [-7.6, -0.2, -4, 1, 0], [3.8, 1.3, -5, 3.75 * 0.45, 1],
    ];
    layout.forEach(([x, y, z, s, wide], i) => {
      const w = wide ? s : s, h = wide ? s / 3.75 : s;
      const shape = roundedRect(w, h, Math.min(w, h) * 0.14);
      const g = new THREE.ShapeGeometry(shape);
      const color = i % 4 === 3 ? accent : brand;
      const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
      const lineGeo = new THREE.BufferGeometry().setFromPoints(shape.getPoints(24));
      const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }));
      const grp = new THREE.Group();
      grp.add(new THREE.Mesh(g, fill), line);
      grp.position.set(x, y, z);
      grp.userData = { x, y, ph: i * 1.7, sp: 0.35 + (i % 3) * 0.12 };
      scene.add(grp);
      cards.push(grp);
      geos.push(g, lineGeo);
      mats.push(fill, line.material);
    });

    const N = 220;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 20; pos[i * 3 + 1] = (Math.random() - 0.5) * 11; pos[i * 3 + 2] = -Math.random() * 8; }
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pm = new THREE.PointsMaterial({ color: brand, size: 0.045, transparent: true, opacity: 0.55, sizeAttenuation: true, depthWrite: false });
    const points = new THREE.Points(pg, pm);
    scene.add(points);
    geos.push(pg); mats.push(pm);

    const recolor = () => {
      const b = rgbVar('--brand'), a = rgbVar('--accent');
      const night = document.documentElement.classList.contains('dark');
      cards.forEach((c, i) => c.children.forEach((o, k) => {
        o.material.color.copy(i % 4 === 3 ? a : b);
        o.material.opacity = k === 0 ? (night ? 0.16 : 0.1) : night ? 0.8 : 0.45; // রাতে ফ্রেমগুলো আলোকিত
      }));
      pm.color.copy(b);
      pm.size = night ? 0.06 : 0.045;
      pm.opacity = night ? 0.85 : 0.55;
    };
    recolor();
    const mo = new MutationObserver(recolor);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const size = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(size);
    ro.observe(el); size();

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true, raf = 0;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(el);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      cards.forEach((c) => {
        const d = c.userData;
        c.position.y = d.y + Math.sin(t * d.sp + d.ph) * 0.35;
        c.position.x = d.x + Math.cos(t * d.sp * 0.7 + d.ph) * 0.2;
        c.rotation.y = Math.sin(t * d.sp * 0.6 + d.ph) * 0.5;
        c.rotation.x = Math.cos(t * d.sp * 0.5 + d.ph) * 0.2;
        c.rotation.z = Math.sin(t * d.sp * 0.3 + d.ph) * 0.12;
      });
      points.rotation.y = t * 0.02;
      camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.45 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
      window.removeEventListener('pointermove', onMove);
      geos.forEach((g) => g.dispose()); mats.forEach((m) => m.dispose());
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className={className} />;
}

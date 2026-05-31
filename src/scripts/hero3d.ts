// Escena 3D del Hero. Se importa de forma dinámica desde Hero.astro para que
// three.js quede en un chunk aparte (fuera del bundle inicial). Los imports
// nombrados permiten que Rollup haga tree-shaking de three.js.
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  CanvasTexture,
  SpriteMaterial,
  Sprite,
  Vector3,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  AdditiveBlending,
} from 'three';

export function initHero3D(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 1, 2000);
  camera.position.z = 580;

  const orbitRoot = new Group();
  scene.add(orbitRoot);

  // ── Canvas texture helpers ───────────────────────────────────
  function rrClip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function makeTex(drawFn: (ctx: CanvasRenderingContext2D) => void) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128;
    const ctx = c.getContext('2d')!;
    rrClip(ctx, 0, 0, 128, 128, 28); ctx.save(); ctx.clip();
    drawFn(ctx);
    ctx.restore();
    return new CanvasTexture(c);
  }

  // ── Icon draw functions ──────────────────────────────────────
  const iconDraws: ((ctx: CanvasRenderingContext2D) => void)[] = [

    // Instagram
    function(ctx) {
      const g = ctx.createLinearGradient(0, 128, 128, 0);
      g.addColorStop(0, '#f09433'); g.addColorStop(0.38, '#e6683c');
      g.addColorStop(0.54, '#dc2743'); g.addColorStop(0.78, '#cc2366');
      g.addColorStop(1, '#bc1888');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineJoin = 'round';
      // Outer rounded square
      rrClip(ctx, 26, 26, 76, 76, 12); ctx.stroke();
      // Lens circle
      ctx.beginPath(); ctx.arc(64, 64, 19, 0, Math.PI * 2); ctx.stroke();
      // Top-right dot
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(91, 37, 6, 0, Math.PI * 2); ctx.fill();
    },

    // Facebook
    function(ctx) {
      ctx.fillStyle = '#1877F2'; ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 86px Georgia, serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('f', 69, 67);
    },

    // WhatsApp
    function(ctx) {
      ctx.fillStyle = '#25D366'; ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#fff';
      // Speech bubble body
      rrClip(ctx, 18, 16, 92, 72, 16); ctx.fill();
      // Tail (bottom-left)
      ctx.beginPath(); ctx.moveTo(26, 88); ctx.lineTo(14, 112); ctx.lineTo(50, 88);
      ctx.closePath(); ctx.fill();
      // Three message lines inside
      ctx.fillStyle = '#25D366';
      [36, 48, 60].forEach(y => { ctx.fillRect(34, y, 60, 7); });
    },

    // LinkedIn
    function(ctx) {
      ctx.fillStyle = '#0A66C2'; ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 50px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('in', 64, 66);
    },

    // Google
    function(ctx) {
      ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, 0, 128, 128);
      const [cx, cy, r, lw] = [64, 64, 36, 15];
      ctx.lineWidth = lw; ctx.lineCap = 'butt';
      [
        [Math.PI * 0.5, Math.PI * 2.5, '#4285F4'],
        [-Math.PI * 0.5, 0,            '#EA4335'],
        [0,              Math.PI * 0.5, '#FBBC05'],
        [Math.PI * 0.5,  Math.PI,       '#34A853'],
      ].forEach(([s, e, col]) => {
        ctx.strokeStyle = col as string;
        ctx.beginPath(); ctx.arc(cx, cy, r, s as number, e as number); ctx.stroke();
      });
      // White center
      ctx.fillStyle = '#f8f9fa';
      ctx.beginPath(); ctx.arc(cx, cy, r - lw + 1, 0, Math.PI * 2); ctx.fill();
      // Horizontal crossbar (blue)
      ctx.fillStyle = '#4285F4'; ctx.fillRect(cx, cy - 8, 36, 16);
      // Round the left end of the bar
      ctx.beginPath(); ctx.arc(cx, cy, 8, -Math.PI / 2, Math.PI / 2); ctx.fill();
    },

    // TikTok
    function(ctx) {
      ctx.fillStyle = '#010101'; ctx.fillRect(0, 0, 128, 128);
      function note(ox: number, oy: number, color: string, alpha: number) {
        ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color;
        // Note head (circle)
        ctx.beginPath(); ctx.arc(55 + ox, 82 + oy, 14, 0, Math.PI * 2); ctx.fill();
        // Stem
        ctx.fillRect(65 + ox, 22 + oy, 9, 62);
        // Top curved flag
        ctx.beginPath(); ctx.arc(74 + ox, 36 + oy, 14, -Math.PI / 2, Math.PI / 2); ctx.fill();
        ctx.beginPath(); ctx.arc(74 + ox, 50 + oy, 9, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      note(3, 0, '#EE1D52', 0.85);
      note(-3, 0, '#69C9D0', 0.85);
      note(0, 0, '#fff', 1);
    },

  ];

  const sprites = iconDraws.map(drawFn => {
    const mat = new SpriteMaterial({
      map: makeTex(drawFn),
      transparent: true,
      opacity: 0.93,
    });
    const sp = new Sprite(mat);
    sp.scale.set(72, 72, 1);
    return sp;
  });

  // ── Orbit groups (3 rings × 2 icons) ────────────────────────
  const orbitDefs = [
    { radius: 172, rx:  0.32, rz:  0.14, speed: 0.38, icons: [0, 3] },  // IG + LI
    { radius: 238, rx: -0.50, rz:  0.09, speed: 0.23, icons: [1, 4] },  // FB + Google
    { radius: 132, rx:  0.68, rz: -0.22, speed: 0.52, icons: [2, 5] },  // WA + TT
  ];

  orbitDefs.forEach(def => {
    const group = new Group();
    group.rotation.x = def.rx;
    group.rotation.z = def.rz;
    orbitRoot.add(group);

    // Orbit ring line
    const pts = Array.from({ length: 65 }, (_, i) => {
      const a = (i / 64) * Math.PI * 2;
      return new Vector3(Math.cos(a) * def.radius, Math.sin(a) * def.radius, 0);
    });
    group.add(new Line(
      new BufferGeometry().setFromPoints(pts),
      new LineBasicMaterial({ color: 0x7c5cf4, transparent: true, opacity: 0.20 }),
    ));

    def.icons.forEach(idx => group.add(sprites[idx]));
  });

  // Central glow
  (() => {
    const gc = document.createElement('canvas'); gc.width = 256; gc.height = 256;
    const gctx = gc.getContext('2d')!;
    const g = gctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0,   'rgba(124,92,244,0.50)');
    g.addColorStop(0.4, 'rgba(108,76,241,0.18)');
    g.addColorStop(1,   'rgba(108,76,241,0)');
    gctx.fillStyle = g; gctx.fillRect(0, 0, 256, 256);
    const gmat = new SpriteMaterial({
      map: new CanvasTexture(gc),
      transparent: true,
      blending: AdditiveBlending,
    });
    const gs = new Sprite(gmat);
    gs.scale.set(400, 400, 1);
    orbitRoot.add(gs);
  })();

  // ── Resize ───────────────────────────────────────────────────
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const mobile = w < 900;
    orbitRoot.position.x = mobile ? 0 : w * 0.14;
    orbitRoot.scale.setScalar(mobile ? 0.72 : 1);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // ── Mouse parallax ────────────────────────────────────────────
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // ── Animation loop ────────────────────────────────────────────
  let t = 0;
  let autoY = 0;

  function tick() {
    requestAnimationFrame(tick);
    t += 0.01;
    autoY += 0.0012;

    const targetY = autoY + mx * 0.28;
    const targetX = my * 0.11;
    orbitRoot.rotation.y += (targetY - orbitRoot.rotation.y) * 0.035;
    orbitRoot.rotation.x += (targetX - orbitRoot.rotation.x) * 0.035;

    orbitDefs.forEach(def => {
      def.icons.forEach((iconIdx, j) => {
        const theta = t * def.speed + j * Math.PI;
        sprites[iconIdx].position.set(
          Math.cos(theta) * def.radius,
          Math.sin(theta) * def.radius,
          0,
        );
      });
    });

    renderer.render(scene, camera);
  }
  tick();
}

/* AZYAN — التأثيرات: لوجو مغناطيسي، جزيئات تهرب من المؤشر، أزرار تنجذب إليه
   كل شيء يعمل بـ transform فقط (لا يغيّر التخطيط) ولا يعترض النقر أو التمرير. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)');
  reduce.addEventListener('change', function () { location.reload(); });
  var m = { x: 0, y: 0, on: false }, timer;
  var clamp = function (v, a) { return Math.max(-a, Math.min(a, v)); };

  function track(e) {                 // الماوس واللمس معًا (اللمس يبقى فعّالًا 0.7 ثانية)
    m.x = e.clientX; m.y = e.clientY; m.on = true; m.touch = e.pointerType !== 'mouse';
    if (m.touch) { clearTimeout(timer); timer = setTimeout(function () { m.on = false; }, 700); }
  }
  addEventListener('pointermove', track, { passive: true });
  addEventListener('pointerdown', track, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { m.on = false; });

  /* --- الجزيئات --- */
  var cv = document.getElementById('particles'), ctx, W, H, ps = [], cols;
  function resize() {
    var pg = cv.parentNode, d = Math.min(devicePixelRatio || 1, 2);
    if (ps.length && pg.clientWidth === W && pg.clientHeight === H) return;   // لا تعِد التوليد إن لم يتغير الحجم
    W = pg.clientWidth; H = pg.clientHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    var cx = W / 2, cy = H * 0.45;
    var n = W < 640 ? 34 : 56, g = function () { return Math.random() + Math.random() - 1; };
    ps = [];
    for (var i = 0; i < n; i++) {
      var near = Math.random() < 0.75;
      ps.push({
        bx: near ? cx + g() * Math.min(W * 0.4, 420) : Math.random() * W,
        by: near ? cy + g() * Math.min(H * 0.34, 380) : Math.random() * H * 0.6,
        ax: 8 + Math.random() * 22, ay: 8 + Math.random() * 22,
        sx: 0.15 + Math.random() * 0.3, sy: 0.15 + Math.random() * 0.3, ph: Math.random() * 6.28,
        r: 0.8 + Math.random() * 1.8, a: 0.45 + Math.random() * 0.5,
        c: Math.random() < 0.7 ? cols[0] : cols[1], ox: 0, oy: 0, vx: 0, vy: 0
      });
    }
    if (reduce.matches) draw(0, false);
  }
  function draw(t, live) {
    ctx.clearRect(0, 0, W, H);
    var pr = cv.getBoundingClientRect(), mx = m.x - pr.left, my = m.y - pr.top, R = 130;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], x = p.bx + Math.sin(t * p.sx + p.ph) * p.ax, y = p.by + Math.cos(t * p.sy + p.ph) * p.ay;
      if (live) {
        if (m.on) {
          var dx = x + p.ox - mx, dy = y + p.oy - my, d = Math.hypot(dx, dy) || 1;
          if (d < R) { var f = Math.pow(1 - d / R, 2) * 2.2; p.vx += dx / d * f; p.vy += dy / d * f; }
        }
        p.vx += -p.ox * 0.018; p.vy += -p.oy * 0.018; p.vx *= 0.9; p.vy *= 0.9;
        p.ox += p.vx; p.oy += p.vy;
      }
      var a = p.a * (0.65 + 0.35 * Math.sin(t * 1.4 + p.ph));
      ctx.fillStyle = p.c;
      ctx.globalAlpha = a * 0.18; ctx.beginPath(); ctx.arc(x + p.ox, y + p.oy, p.r * 3.2, 0, 6.283); ctx.fill();
      ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x + p.ox, y + p.oy, p.r, 0, 6.283); ctx.fill();
    }
  }

  /* --- اللوجو والأزرار --- */
  var logo = document.getElementById('logo'), stage = document.querySelector('.bgLogo');
  var L = { x: 0, y: 0, vx: 0, vy: 0 };
  var mags = [].map.call(document.querySelectorAll('[data-magnet]'), function (el) {
    return { el: el, x: 0, y: 0, s: 1, g: 0, px: 50, py: 50 };
  });
  function step() {
    var tx = 0, ty = 0;
    if (logo && m.on && !m.touch) {                                // منطقة تأثير محدودة حول اللوجو
      var r = stage.getBoundingClientRect(), dx = m.x - (r.left + r.width / 2), dy = m.y - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < 420) { tx = clamp(dx * 0.05, 16); ty = clamp(dy * 0.05, 16); }
    }
    if (logo) {                                        // نابض: حركة ناعمة وعودة مرنة
      L.vx += (tx - L.x) * 0.06; L.vy += (ty - L.y) * 0.06; L.vx *= 0.82; L.vy *= 0.82;
      L.x += L.vx; L.y += L.vy;
      logo.style.transform = 'translate3d(' + L.x.toFixed(2) + 'px,' + L.y.toFixed(2) + 'px,0)';
    }
    mags.forEach(function (o) {
      var tX = 0, tY = 0, tS = 1, tG = 0;
      if (m.on && !m.touch) {
        var r = o.el.getBoundingClientRect(), w = r.width, h = r.height;
        var cx = r.left + w / 2 - o.x, cy = r.top + h / 2 - o.y;   // المركز الأصلي دون الإزاحة الحالية
        var dx = m.x - cx, dy = m.y - cy;
        var d = Math.hypot(Math.max(Math.abs(dx) - w / 2, 0), Math.max(Math.abs(dy) - h / 2, 0));
        if (d < 110) {
          var t = 1 - d / 110;
          tX = clamp(dx * 0.05, 9) * t; tY = clamp(dy * 0.05, 7) * t; tS = 1 + 0.025 * t; tG = t;
          o.px = 50 + dx / w * 100; o.py = 50 + dy / h * 100;
        }
      }
      o.x += (tX - o.x) * 0.14; o.y += (tY - o.y) * 0.14; o.s += (tS - o.s) * 0.14; o.g += (tG - o.g) * 0.14;
      o.el.style.transform = 'translate3d(' + o.x.toFixed(2) + 'px,' + o.y.toFixed(2) + 'px,0) scale(' + o.s.toFixed(4) + ')';
      o.el.style.setProperty('--g', o.g.toFixed(3));
      o.el.style.setProperty('--px', o.px.toFixed(1) + '%');
      o.el.style.setProperty('--py', o.py.toFixed(1) + '%');
    });
  }

  /* --- حديقة ورود وفراشات واقعية الشكل: بتلات عضوية وتدرجات وعروق وظلال --- */
  var gc = document.getElementById('garden'), gx, GW = 0, GH = 0, fl = [], bf = [];
  var TY = ['rose', 'tulip', 'rose', 'gerbera', 'rose', 'tulip', 'gerbera'];
  var PALS = {
    rose: [['#FFE3EA', '#F59BB5', '#C7466F'], ['#FFF1E8', '#F7B79A', '#D9694C'], ['#FFFFFF', '#F3DEE5', '#C9A0B3'], ['#FFE0E9', '#FF7FA3', '#B8264F']],
    tulip: [['#FFF7C4', '#FFD54A', '#E3A01B'], ['#FFE6F0', '#FF9EBE', '#D9487A'], ['#F6ECFF', '#C7A3F2', '#7E4FC4']],
    gerbera: [['#FFE9C4', '#FFA23A', '#E0600F'], ['#FFE0EC', '#FF7FAE', '#D1336E'], ['#FFF8CC', '#FFD84A', '#E0A60F'], ['#FFFFFF', '#FBE3EA', '#E8A9BE']]
  };
  var BT = [{ a: '#F8A944', b: '#DE5E0E', e: '#1C1210', d: 1 }, { a: '#8FDAFF', b: '#1F6FDC', e: '#0D1830', d: 0 },
    { a: '#FFEC85', b: '#F0BC22', e: '#1C1210', d: 1 }, { a: '#FFFFFF', b: '#D9D3EA', e: '#5B566B', d: 0 }];
  function pet(x, w, h) {              // بتلة عضوية مدببة قليلًا
    x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(-w, -h * 0.2, -w * 1.1, -h * 0.85, 0, -h); x.bezierCurveTo(w * 1.1, -h * 0.85, w, -h * 0.2, 0, 0);
  }
  function shade(x, w, h, P) {         // قاعدة داكنة ← حافة فاتحة + عرق وحافة مضيئة
    var g = x.createLinearGradient(0, 0, 0, -h); g.addColorStop(0, P[2]); g.addColorStop(0.45, P[1]); g.addColorStop(1, P[0]);
    pet(x, w, h); x.fillStyle = g; x.fill(); x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.stroke();
    x.strokeStyle = 'rgba(90,20,50,.18)'; x.beginPath(); x.moveTo(0, -h * 0.1); x.quadraticCurveTo(w * 0.1, -h * 0.5, 0, -h * 0.9); x.stroke();
  }
  function sprite(tp, r, P, d) {       // وردة (جوري) / توليب / جربيرا تُرسم مرة واحدة
    var S = Math.ceil(r * 3.2), c = document.createElement('canvas'), x, i, ay = tp === 'tulip' ? S * 0.82 : S / 2;
    c.width = c.height = S * d; x = c.getContext('2d'); x.scale(d, d); x.translate(S / 2, ay);
    if (tp === 'rose') {
      [[6, 1, 0], [5, 0.78, 0.4], [4, 0.58, 0.9], [3, 0.4, 1.5]].forEach(function (L, li) {
        var Q = li < 2 ? P : [P[1], P[2], P[2]];
        for (i = 0; i < L[0]; i++) { x.save(); x.rotate(L[2] + i * 6.283 / L[0] + (Math.random() - 0.5) * 0.3); shade(x, r * L[1] * 0.62, r * L[1], Q); x.restore(); }
      });
      x.strokeStyle = 'rgba(120,30,60,.4)'; x.lineWidth = 1;
      for (i = 0; i < 3; i++) { x.beginPath(); x.arc(0, 0, r * (0.08 + 0.06 * i), i * 2, i * 2 + 4); x.stroke(); }
    } else if (tp === 'tulip') {
      [[-0.3, 0.55, 1.55, 1], [0.3, 0.55, 1.55, 1], [-0.12, 0.5, 1.7, 0], [0.12, 0.5, 1.7, 0], [0, 0.62, 1.75, 0]].forEach(function (T) {
        x.save(); x.rotate(T[0]); shade(x, r * T[1], r * T[2], T[3] ? [P[1], P[2], P[2]] : P); x.restore();
      });
    } else {
      for (var k = 0; k < 2; k++) for (i = 0; i < 18 - k * 4; i++) {
        x.save(); x.rotate(k * 0.17 + i * 6.283 / (18 - k * 4)); shade(x, r * 0.17, r * (1.2 - k * 0.22), k ? [P[0], P[0], P[1]] : P); x.restore();
      }
      var g = x.createRadialGradient(0, 0, 0, 0, 0, r * 0.32); g.addColorStop(0, '#2E1B0D'); g.addColorStop(0.6, '#5A3A1B'); g.addColorStop(1, '#E8B53C');
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * 0.32, 0, 6.283); x.fill();
    }
    return { c: c, S: S, ay: ay, top: tp !== 'tulip' };
  }
  function gInit() {
    if (fl.length && gc.clientWidth === GW && gc.clientHeight === GH) return;
    var d = Math.min(devicePixelRatio || 1, 2), i;
    GW = gc.clientWidth; GH = gc.clientHeight;
    gc.width = GW * d; gc.height = GH * d; gx = gc.getContext('2d'); gx.setTransform(d, 0, 0, d, 0, 0);
    var sm = GW < 640, n = Math.max(7, Math.min(20, Math.round(GW / 72))), boost = sm ? 0.2 : 0.38;
    fl = []; bf = [];
    for (i = 0; i < n; i++) {
      var x = (i + 0.5 + (Math.random() - 0.5) * 0.5) * GW / n, edge = Math.abs(x - GW / 2) / (GW / 2), z = 0.75 + Math.random() * 0.25;
      var tp = TY[i % 7], pl = PALS[tp], r = ((tp === 'tulip' ? 21 : 30) * (sm ? 0.78 : 1) + Math.random() * 10) * z;
      fl.push({ x: x, z: z, r: r, h: GH * (0.46 + boost * edge) * (0.8 + Math.random() * 0.2), sp: sprite(tp, r, pl[i % pl.length], d),
        rot: Math.random() * 6.28, ph: Math.random() * 6.28, sw: 0.5 + Math.random() * 0.5, o: 0, v: 0 });
    }
    fl.sort(function (a, b) { return a.z - b.z; });
    for (i = 0; i < (sm ? 4 : 6); i++) {
      bf.push({ ax: sm ? GW * (0.1 + Math.random() * 0.8) : GW * ((i % 2 ? 0.04 : 0.7) + Math.random() * 0.26), ay: GH * (0.3 + Math.random() * 0.3),
        s: 11 + Math.random() * 5, k: i % 4, ph: Math.random() * 6.28, s1: 0.25 + Math.random() * 0.25, s2: 0.3 + Math.random() * 0.3, ox: 0, oy: 0, vx: 0, vy: 0 });
    }
    if (reduce.matches) gDraw(0, false);
  }
  function leaf(x, y, rot, s) {
    gx.save(); gx.translate(x, y); gx.rotate(rot);
    var g = gx.createLinearGradient(-s, 0, s, 0); g.addColorStop(0, '#2A7F54'); g.addColorStop(1, '#86DBA8');
    gx.fillStyle = g; gx.strokeStyle = 'rgba(20,70,40,.45)'; gx.lineWidth = 0.8;
    gx.beginPath(); gx.moveTo(0, 0); gx.quadraticCurveTo(s * 1.1, -s * 1.1, 0, -s * 3); gx.quadraticCurveTo(-s * 1.1, -s * 1.1, 0, 0); gx.fill(); gx.stroke();
    gx.strokeStyle = 'rgba(255,255,255,.4)'; gx.beginPath(); gx.moveTo(0, 0); gx.lineTo(0, -s * 2.7); gx.stroke(); gx.restore();
  }
  function wp(i, s) {                  // جناح أمامي/خلفي
    var p = new Path2D();
    if (i) { p.moveTo(0, 0.05 * s); p.bezierCurveTo(1.2 * s, 0.1 * s, 1.8 * s, 0.6 * s, 1.25 * s, 1.25 * s); p.bezierCurveTo(0.8 * s, 1.65 * s, 0.15 * s, 1.2 * s, 0, 0.05 * s); }
    else { p.moveTo(0, 0); p.bezierCurveTo(0.2 * s, -1.5 * s, 1.7 * s, -1.7 * s, 2.05 * s, -0.7 * s); p.bezierCurveTo(2.15 * s, -0.2 * s, 1.2 * s, 0.1 * s, 0, 0.1 * s); }
    return p;
  }
  function wing(s, k) {                // فراشة واقعية: ملكية / زرقاء / ذيل السنونو / بيضاء
    var T = BT[k], g = gx.createRadialGradient(0, 0, 0, s * 0.9, -s * 0.3, s * 2.1);
    g.addColorStop(0, T.a); g.addColorStop(1, T.b);
    [0, 1].forEach(function (i) {
      var p = wp(i, s); gx.fillStyle = g; gx.fill(p); gx.save(); gx.clip(p);
      gx.strokeStyle = T.e; gx.globalAlpha = 0.75; gx.lineWidth = 0.07 * s; gx.beginPath();
      (i ? [[1.7, 0.5], [1.2, 1], [0.6, 1.1]] : [[1.95, -0.55], [1.7, -1.1], [1.1, -1.4], [1.85, -0.15]]).forEach(function (q) {
        gx.moveTo(0, 0); gx.quadraticCurveTo(q[0] * s * 0.5, q[1] * s * 0.35, q[0] * s, q[1] * s);
      });
      gx.stroke(); gx.globalAlpha = 1;
      if (T.d) { gx.fillStyle = '#fff'; (i ? [[1.15, 1], [0.85, 1.2]] : [[1.85, -0.9], [1.55, -1.25], [1.95, -0.45], [1.15, -1.35]]).forEach(function (q) { gx.beginPath(); gx.arc(q[0] * s, q[1] * s, 0.06 * s, 0, 6.283); gx.fill(); }); }
      if (!i) { gx.fillStyle = 'rgba(255,255,255,.22)'; gx.beginPath(); gx.ellipse(0.9 * s, -0.6 * s, 0.5 * s, 0.18 * s, -0.5, 0, 6.283); gx.fill(); }
      gx.restore(); gx.strokeStyle = T.e; gx.lineWidth = 0.14 * s; gx.stroke(p);
    });
  }
  function gDraw(t, live) {
    gx.clearRect(0, 0, GW, GH);
    var pr = gc.getBoundingClientRect(), mx = m.x - pr.left, my = m.y - pr.top, on = live && m.on;
    fl.forEach(function (f) {          // الورد: يتمايل وينحني بعيدًا عن المؤشر/اللمس
      var sw = live ? Math.sin(t * f.sw + f.ph) * f.h * 0.05 : 0;
      if (live) {
        if (on) { var dx = f.x + f.o + sw - mx, dy = GH - f.h - my, d = Math.hypot(dx, dy) || 1; if (d < 170) f.v += dx / d * (1 - d / 170) * 2.4; }
        f.v -= f.o * 0.03; f.v *= 0.9; f.o = clamp(f.o + f.v, f.h * 0.4);
      }
      var b = f.o + sw, X = f.x + b, Y = GH - f.h + Math.abs(b) * 0.12, cx = f.x + b * 0.1, cy = GH - f.h * 0.55, S = f.sp.S;
      gx.globalAlpha = 0.8 + 0.2 * (f.z - 0.75) / 0.25;
      var st = new Path2D(); st.moveTo(f.x, GH + 4); st.quadraticCurveTo(cx, cy, X, Y);
      gx.lineCap = 'round'; gx.strokeStyle = '#2B7A52'; gx.lineWidth = 4.6 * f.z; gx.stroke(st);
      gx.strokeStyle = '#6BCB94'; gx.lineWidth = 1.6 * f.z; gx.save(); gx.translate(-1.1 * f.z, 0); gx.stroke(st); gx.restore();
      [0.36, 0.6].forEach(function (u, k) {
        var q = 1 - u;
        leaf(q * q * f.x + 2 * q * u * cx + u * u * X, q * q * (GH + 4) + 2 * q * u * cy + u * u * Y, (k ? 1 : -1) * 0.95, 6 * f.z + 2);
      });
      gx.save(); gx.translate(X, Y); gx.rotate(b * 0.004);
      if (f.sp.top) { gx.scale(1 - Math.min(0.3, Math.abs(b) / f.h), 1); gx.rotate(f.rot); }
      gx.shadowColor = 'rgba(60,10,25,.4)'; gx.shadowBlur = 12; gx.shadowOffsetY = 5;
      gx.drawImage(f.sp.c, -S / 2, -f.sp.ay, S, S); gx.restore(); gx.globalAlpha = 1;
    });
    bf.forEach(function (b) {          // الفراشات: تحوم حول الورد وتهرب من المؤشر/اللمس
      var x = b.ax + Math.sin(t * b.s1 + b.ph) * 90, y = b.ay + Math.cos(t * b.s2 + b.ph) * 45, fp = 1, tilt = 0;
      if (live) {
        if (on) { var dx = x + b.ox - mx, dy = y + b.oy - my, d = Math.hypot(dx, dy) || 1; if (d < 180) { var q = Math.pow(1 - d / 180, 2) * 3.4; b.vx += dx / d * q; b.vy += dy / d * q; } }
        b.vx -= b.ox * 0.012; b.vy -= b.oy * 0.012; b.vx *= 0.9; b.vy *= 0.9; b.ox += b.vx; b.oy += b.vy;
        fp = 0.22 + 0.78 * Math.abs(Math.sin(t * 12 + b.ph)); tilt = clamp(Math.cos(t * b.s1 + b.ph) * 0.35 + b.vx * 0.05, 0.6);
        y += Math.sin(t * 12 + b.ph) * 1.5;
      }
      gx.save(); gx.translate(x + b.ox, y + b.oy); gx.rotate(tilt);
      gx.shadowColor = 'rgba(50,10,25,.35)'; gx.shadowBlur = 10; gx.shadowOffsetY = 8; gx.shadowOffsetX = 4;
      [1, -1].forEach(function (sd) { gx.save(); gx.scale(sd * fp, 1); wing(b.s, b.k); gx.restore(); });
      var bg = gx.createLinearGradient(-b.s * 0.1, 0, b.s * 0.1, 0); bg.addColorStop(0, '#7A5644'); bg.addColorStop(1, '#2D1D17');
      gx.fillStyle = bg; gx.beginPath(); gx.ellipse(0, 0, b.s * 0.1, b.s * 0.55, 0, 0, 6.283); gx.fill();
      gx.beginPath(); gx.arc(0, -b.s * 0.6, b.s * 0.12, 0, 6.283); gx.fill();
      gx.shadowColor = 'transparent'; gx.strokeStyle = '#2D1D17'; gx.lineWidth = 0.9; gx.beginPath();
      gx.moveTo(-b.s * 0.04, -b.s * 0.68); gx.quadraticCurveTo(-b.s * 0.2, -b.s * 1, -b.s * 0.4, -b.s * 1.05);
      gx.moveTo(b.s * 0.04, -b.s * 0.68); gx.quadraticCurveTo(b.s * 0.2, -b.s * 1, b.s * 0.4, -b.s * 1.05); gx.stroke();
      gx.restore();
    });
  }

  function tick(now) {
    step();
    if (cv) draw(now / 1000, true);
    if (gc) gDraw(now / 1000, true);
    requestAnimationFrame(tick);
  }
  if (cv) {
    ctx = cv.getContext('2d');
    var cs = getComputedStyle(document.documentElement);
    cols = [cs.getPropertyValue('--gold').trim() || '#AA8B55', cs.getPropertyValue('--sand').trim() || '#D9C7A5'];
    resize();
    addEventListener('resize', resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(cv.parentNode);
  }
  if (gc) { gInit(); addEventListener('resize', gInit); }
  if (!reduce.matches) requestAnimationFrame(tick);
})();

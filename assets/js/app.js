/* AZYAN — بناء الصفحات والترجمة وروابط التواصل */
(function () {
  var A = window.AZYAN, B = document.body, R = B.dataset.root || '';
  var FILE = location.protocol === 'file:';
  var DEV = FILE || /^(localhost|127\.0\.0\.1)$/.test(location.hostname) || /[?&]dev\b/.test(location.search);
  var url = function (p) { return p ? R + p + (FILE ? '/index.html' : '/') : (R || './') + (FILE ? 'index.html' : ''); };
  var byId = {}; A.services.forEach(function (s) { byId[s.id] = s; });
  var svc = byId[B.dataset.service];
  var lang = 'ar';
  try { lang = localStorage.getItem('azyan-lang') === 'en' ? 'en' : 'ar'; } catch (e) {}

  var IC = {
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8C10 8 7.5 7 7.5 5.2 7.5 3.8 9 3.5 10 4.5 11 5.5 12 8 12 8zm0 0c2 0 4.5-1 4.5-2.8 0-1.4-1.5-1.7-2.5-.7C13 5.5 12 8 12 8z"/>',
    flower: '<circle cx="12" cy="12" r="2.5"/><path d="M12 9.5C10 7 10 4 12 2c2 2 2 5 0 7.5zM12 14.5c2 2.5 2 5.5 0 7.5-2-2-2-5 0-7.5zM9.5 12C7 10 4 10 2 12c2 2 5 2 7.5 0zM14.5 12c2.5-2 5.5-2 7.5 0-2 2-5 2-7.5 0z"/>',
    event: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6z"/>',
    mega: '<path d="M3 11v3a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1zM18.5 9a4 4 0 0 1 0 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    whatsapp: '<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.5L3 21z"/><path d="M9 8.5c.4 2.6 2.4 4.6 5 5.2l1.3-1.3-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.3 2.4 1.9 4 4.5 4.2"/>'
  };
  var svg = function (n, c) {
    return '<svg class="ic ' + (c || '') + '" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + IC[n] + '</svg>';
  };
  var switcher = '<div class="lang" role="group" aria-label="اللغة / Language">' +
    '<button type="button" data-lang="ar" lang="ar" aria-label="العربية">AR</button>' +
    '<button type="button" data-lang="en" lang="en" aria-label="English">EN</button></div>';
  var foot = '<footer class="foot"><small>© <span id="yr"></span> AZYAN · <span data-t="rights"></span></small></footer>';

  var app = document.getElementById('app'), html;
  if (!svc) { // الصفحة الرئيسية
    html = '<div class="page home-page"><div class="bgLogo" role="img" aria-label="AZYAN"><img id="logo" class="logo" src="assets/img/logo.png" width="468" height="720" alt=""></div><canvas id="particles" aria-hidden="true"></canvas><canvas id="garden" aria-hidden="true"></canvas>' +
      '<a class="skip" href="#main" data-t="skip"></a>' +
      '<header class="bar"><span></span>' + switcher + '</header>' +
      '<main id="main" class="home">' +
            '<div class="topLogo"><img src="assets/img/logo.png" width="468" height="720" alt="AZYAN"></div><h1 class="sub" data-t="sub"></h1><nav class="grid">' +
      A.services.map(function (s) {
        return '<a class="card' + (s.neon ? ' neon' : '') + (s.light ? ' light' : '') + '" data-magnet style="--bg:' + s.bg + ';--glow:' + s.glow + '" href="' + url(s.path) + '">' +
          '<span class="txt"><strong data-f="name" data-id="' + s.id + '"></strong><small data-f="name2" data-id="' + s.id + '"></small></span>' +
          '<img class="art" src="' + s.card + '" alt="" aria-hidden="true"></a>';
      }).join('') + '</nav></main>' + foot + '</div>';
  } else { // صفحة مجال
    html = '<div class="page">' +
      '<a class="skip" href="#main" data-t="skip"></a>' +
      '<header class="bar"><a class="back" href="' + url('') + '">' + svg('arrow', 'bk') + '<span data-t="home"></span></a>' +
      '<a class="mini" href="' + url('') + '" aria-label="AZYAN"><img src="' + R + 'assets/img/logo.png" width="31" height="48" alt="AZYAN"></a>' + switcher + '</header>' +
      '<main id="main" class="svc' + (svc.light ? ' light' : '') + '" style="--bg:' + svc.bg + '"><div class="media">' +
      '<img class="photo" id="photo" src="' + R + svc.image + '" alt="" onerror="this.parentNode.classList.add(\'noimg\')">' +
      '<div class="ph"><img class="art2" src="' + R + svc.card + '" alt=""><small id="phNote"></small></div></div>' +
      '<section class="info"><p class="eyebrow" data-f="name2"></p><h1 data-f="name"></h1><p class="desc" data-f="desc"></p>' +
      '<div class="cta" id="cta"></div><div id="dev"></div>' +
      '<nav class="more"><h2 data-t="other"></h2><ul>' +
      A.services.filter(function (s) { return s.id !== svc.id; }).map(function (s) {
        return '<li><a href="' + url(s.path) + '" data-f="name" data-id="' + s.id + '"></a></li>';
      }).join('') + '</ul></nav></section></main>' + foot + '</div>';
  }
  app.innerHTML = html;
  document.getElementById('yr').textContent = new Date().getFullYear();

  function norm(k, v) {
    if (!v) return '';
    if (/^https?:\/\//i.test(v)) return v;
    v = v.replace(/^@/, '');
    return k === 'instagram' ? 'https://instagram.com/' + v : 'https://www.tiktok.com/@' + v;
  }
  function renderCta(T) {
    var s = svc, miss = [];
    var wa = (s.whatsapp || '').replace(/\D/g, '');
    var items = [
      ['whatsapp', wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent(T.waMsg.replace('{s}', s.name[lang])) : '', 'wa', 'primary'],
      ['instagram', norm('instagram', s.instagram), 'ig', ''],
      ['tiktok', norm('tiktok', s.tiktok), 'tt', '']
    ];
    document.getElementById('cta').innerHTML = items.map(function (i) {
      var inner = svg(i[0]) + '<span data-t="' + i[2] + '"></span>';
      if (i[1]) return '<a class="btn ' + i[3] + '" href="' + i[1] + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
      miss.push(i[0]);
      return DEV ? '<span class="btn off" aria-disabled="true">' + inner + '</span>' : '';
    }).join('');
    document.getElementById('dev').innerHTML = DEV && miss.length ? '<p class="dev" role="note">' + T.missing + ' ' + miss.join(' · ') + '</p>' : '';
    var ph = document.getElementById('phNote');
    ph.textContent = DEV ? T.noImg + ' ' + s.image : '';
    document.getElementById('photo').alt = s.alt[lang];
  }

  function apply() {
    var T = A.i18n[lang], other = lang === 'ar' ? 'en' : 'ar', h = document.documentElement;
    h.lang = lang; h.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (svc) renderCta(T);
    document.querySelectorAll('[data-t]').forEach(function (e) { e.textContent = T[e.dataset.t]; });
    document.querySelectorAll('[data-f]').forEach(function (e) {
      var s = byId[e.dataset.id] || svc, f = e.dataset.f;
      e.textContent = f === 'name' ? s.name[lang] : f === 'name2' ? s.name[other] : s.desc[lang];
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === lang); });
    document.title = svc ? svc.name[lang] + ' — AZYAN' : 'AZYAN — ' + T.tagline;
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.dataset.lang;
      try { localStorage.setItem('azyan-lang', lang); } catch (e) {}
      apply();
    });
  });
  apply();
})();

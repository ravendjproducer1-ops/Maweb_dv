(() => {
  const O = window.SITE_OVERRIDES || {}, $ = s => document.querySelector(s), L = O.links || {}, F = O.flags || {};
  if (O.brand) $('.brand-name').firstChild.textContent = O.brand + ' ';
  if (L.email) { const c = $('#copyEmailBtn'); c.dataset.email = L.email; c.querySelector('.email-text-val').textContent = L.email; }
  if (L.telegram) document.querySelectorAll('a[href*="t.me/"]').forEach(a => a.href = L.telegram);
  if (L.github) document.querySelectorAll('a[href*="github.com/"]').forEach(a => a.href = L.github);
  if (L.linkedin) $('.social-btn.linkedin').href = L.linkedin;
  if (F.games === false) document.querySelectorAll('#iqgame,a[href="#iqgame"]').forEach(e => e.style.display = 'none');
  if (F.rain === false) $('#matrixCanvas').style.display = 'none';
  if (O.theme && !localStorage.getItem('site_theme_color')) { $('.color-dot.' + O.theme)?.click(); localStorage.removeItem('site_theme_color'); }

  // announcement banner
  const bt = O.banner && O.banner.text;
  if (bt && sessionStorage.getItem('ann') !== bt) {
    const b = document.createElement('div'); b.className = 'announce';
    b.innerHTML = `<span>${ic('megaphone', 16)} ${bt}</span><button aria-label="close">${ic('x', 16)}</button>`;
    b.querySelector('button').onclick = () => { b.remove(); sessionStorage.setItem('ann', bt); };
    document.body.prepend(b);
  }

  // typewriter roles
  const R = O.roles && O.roles.length ? O.roles : ['FiveM Developer', 'Lua Scripter', 'System Admin', 'UI/UX Builder'], d = $('.hero-desc');
  if (d) {
    const p = document.createElement('p'); p.className = 'typer'; p.innerHTML = '' + ic('zap', 18) + ' <span></span><i class="caret"></i>'; d.before(p);
    const t = p.querySelector('span'); let r = 0, i = 0, del = 0;
    const step = () => {
      const w = R[r]; i += del ? -1 : 1; t.textContent = w.slice(0, i); let ms = del ? 35 : 70;
      if (!del && i === w.length) { del = 1; ms = 1400; } else if (del && i === 0) { del = 0; r = (r + 1) % R.length; ms = 300; }
      setTimeout(step, ms);
    };
    matchMedia('(prefers-reduced-motion: reduce)').matches ? t.textContent = R[0] : step();
  }

  // floating buttons + website QR
  const fw = document.createElement('div'); fw.className = 'fab-wrap';
  fw.innerHTML = '<button class="fab" id="qrBtn" title="QR">'+ic('qr',22)+'</button><button class="fab" id="topBtn" title="Top">'+ic('up',22)+'</button>'; document.body.append(fw);
  const m = document.createElement('div'); m.className = 'modal';
  m.innerHTML = '<div class="modal-card"><button class="modal-x">'+ic('x',20)+'</button><h3>QR Code · គេហទំព័រ</h3><div id="qrBox"></div><small id="qrUrl"></small><div class="qr-actions"><button class="btn-glow" id="qrDl">'+ic('download',16)+' PNG</button><button class="btn-glass" id="qrCopy">'+ic('link',16)+' Copy link</button></div></div>'; document.body.append(m);
  const url = O.siteUrl || location.href.split('#')[0]; $('#qrUrl').textContent = url; let made = 0;
  const open = o => {
    m.classList.toggle('open', o);
    if (o && !made && window.QRCode) { new QRCode($('#qrBox'), { text: url, width: 240, height: 240, colorDark: '#0b1020', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H }); made = 1; }
  };
  $('#qrBtn').onclick = () => open(1); m.querySelector('.modal-x').onclick = () => open(0);
  m.onclick = e => e.target === m && open(0); addEventListener('keydown', e => e.key === 'Escape' && open(0));
  $('#qrDl').onclick = () => { const c = $('#qrBox canvas'), a = document.createElement('a'); a.href = c ? c.toDataURL('image/png') : $('#qrBox img').src; a.download = 'website-qr.png'; a.click(); };
  $('#qrCopy').onclick = e => { const b = e.currentTarget; navigator.clipboard.writeText(url).then(() => { b.innerHTML = ic('check', 16) + ' Copied'; setTimeout(() => b.innerHTML = ic('link', 16) + ' Copy link', 1500); }); };
  const tb = $('#topBtn'); tb.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  addEventListener('scroll', () => tb.classList.toggle('show', scrollY > 600), { passive: true });

  // preloader
  const pl = document.createElement('div'); pl.className = 'preloader'; pl.innerHTML = '<img src="LOGO-2.webp" alt="" width="84" height="84"><i></i>'; document.body.append(pl);
  const hide = () => { pl.classList.add('off'); setTimeout(() => pl.remove(), 700); };
  document.readyState === 'complete' ? setTimeout(hide, 300) : addEventListener('load', () => setTimeout(hide, 250)); setTimeout(hide, 3500);
  // background grid
  const g = document.createElement('div'); g.className = 'bg-grid'; document.body.prepend(g);
  // skills marquee
  const hero = $('.hero-section');
  if (hero) { const row = ['FiveM', 'Lua', 'Qbox', 'ox_lib', 'React', 'TypeScript', 'Node.js', 'MySQL', 'NUI', 'Express'].map(x => `<span>${x}</span>`).join(''); const mq = document.createElement('div'); mq.className = 'marquee'; mq.innerHTML = `<div class="track">${row}${row}</div>`; hero.after(mq); }
  // 3D tilt on cards (desktop only)
  if (matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches)
    document.querySelectorAll('.tech-card,.bento-box').forEach(el => {
      el.classList.add('tilt'); let r = 0;
      el.addEventListener('mousemove', e => { if (r) return; r = requestAnimationFrame(() => { const b = el.getBoundingClientRect(); el.style.setProperty('--ry', ((e.clientX - b.left) / b.width - .5) * 6 + 'deg'); el.style.setProperty('--rx', ((e.clientY - b.top) / b.height - .5) * -6 + 'deg'); r = 0; }); });
      el.addEventListener('mouseleave', () => { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); });
    });
})();

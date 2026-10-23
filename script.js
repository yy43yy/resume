(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('themeToggle');
  const systemTheme = matchMedia('(prefers-color-scheme: dark)');
  let preferredTheme;
  try { preferredTheme = localStorage.getItem('yy-theme'); } catch { /* Storage may be unavailable. */ }
  function applyTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    themeButton.querySelector('.lamp-label').textContent = dark ? 'lights on?' : 'lights off?';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#1c201c' : '#f5f3ec';
  }
  applyTheme(preferredTheme ? preferredTheme === 'dark' : systemTheme.matches);
  themeButton.addEventListener('click', () => {
    preferredTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(preferredTheme === 'dark');
    try { localStorage.setItem('yy-theme', preferredTheme); } catch { /* Theme still works for this visit. */ }
  });
  systemTheme.addEventListener('change', event => { if (!preferredTheme) applyTheme(event.matches); });
  const photos = [...document.querySelectorAll('.photo-card')];
  photos.forEach(photo => photo.addEventListener('click', () => photos.forEach(item => {
    item.classList.toggle('is-front', item === photo);
    item.setAttribute('aria-pressed', String(item === photo));
  })));
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let visible = 0;
    projects.forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) visible++;
    });
    document.getElementById('filter-status').textContent = `Showing ${visible} ${category === 'all' ? '' : category + ' '}project${visible === 1 ? '' : 's'}.`;
  }));
  const copyButton = document.getElementById('copyEmail');
  let copyReset;
  copyButton.addEventListener('click', async () => {
    clearTimeout(copyReset);
    const status = document.getElementById('copy-status');
    copyButton.disabled = true;
    try {
      await navigator.clipboard.writeText('yiyang15624@gmail.com');
      copyButton.textContent = 'Copied ✓';
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Select the email address to copy, or click it to open your mail app.';
    } finally {
      copyButton.disabled = false;
      copyReset = setTimeout(() => { copyButton.textContent = 'Copy ⧉'; status.textContent = ''; }, 4500);
    }
  });
  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.site-header nav a')];
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
  }
  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* ============================================================
   CodeNoFrontier — script.js
   Premium interactions, animations, and behaviors
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────────
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state
  const hoverTargets = 'a, button, [role="button"], .service-item, .project-card, .nav-cta, .btn-primary, .btn-ghost';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hover'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();


// ─────────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────────
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const max  = document.body.scrollHeight - window.innerHeight;
    const curr = window.scrollY;
    bar.style.width = (curr / max * 100).toFixed(2) + '%';
  }, { passive: true });
})();


// ─────────────────────────────────────────────────
// NAVBAR — blur on scroll + mobile toggle
// ─────────────────────────────────────────────────
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const toggle     = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navbar) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastY = y;
  }, { passive: true });

  // Mobile toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate hamburger → X
      const spans = toggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const spans = toggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      });
    });
  }
})();


// ─────────────────────────────────────────────────
// INTERSECTION OBSERVER — Reveal Animations
// ─────────────────────────────────────────────────
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


// ─────────────────────────────────────────────────
// COUNTER ANIMATION
// ─────────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.counter, .stat-num');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


// ─────────────────────────────────────────────────
// PARALLAX — Hero orbs on mousemove
// ─────────────────────────────────────────────────
(function initParallax() {
  const orbs = document.querySelectorAll('.hero-orb');
  if (!orbs.length) return;

  let ticking = false;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 40;
    my = (e.clientY / window.innerHeight - 0.5) * 40;

    if (!ticking) {
      requestAnimationFrame(() => {
        orbs[0] && (orbs[0].style.transform = `translate(${mx * 0.6}px, ${my * 0.6}px)`);
        orbs[1] && (orbs[1].style.transform = `translate(${-mx * 0.4}px, ${-my * 0.4}px)`);
        ticking = false;
      });
      ticking = true;
    }
  });
})();


// ─────────────────────────────────────────────────
// CHART BARS — animate on view
// ─────────────────────────────────────────────────
(function initChartBars() {
  const chart = document.querySelector('.ps-chart');
  if (!chart) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.chart-bar');
        bars.forEach((bar, i) => {
          const h = bar.style.height;
          bar.style.height = '0%';
          setTimeout(() => {
            bar.style.height = h;
            bar.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          }, i * 80 + 300);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(chart);
})();


// ─────────────────────────────────────────────────
// SERVICE ITEMS — subtle magnetic hover
// ─────────────────────────────────────────────────
(function initMagneticServices() {
  const items = document.querySelectorAll('.service-item:not(.service-item--cta)');

  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      item.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
      item.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), background var(--transition)';
    });

    item.addEventListener('mouseenter', () => {
      item.style.transition = 'transform 0.15s ease, background var(--transition)';
    });
  });
})();


// ─────────────────────────────────────────────────
// PROJECT CARDS — tilt on hover
// ─────────────────────────────────────────────────
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;

      card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow var(--transition)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease, box-shadow var(--transition)';
    });
  });
})();


// ─────────────────────────────────────────────────
// SMOOTH SCROLL for anchor links
// ─────────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ─────────────────────────────────────────────────
// STAGGER hero elements on load
// ─────────────────────────────────────────────────
(function initHeroEntrance() {
  // All hero reveal-up elements
  const heroReveal = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right');
  heroReveal.forEach(el => {
    // Already visible — let the CSS handle it via short delay
    setTimeout(() => el.classList.add('visible'), 100);
  });
})();


// ─────────────────────────────────────────────────
// CTA section parallax orbs on scroll
// ─────────────────────────────────────────────────
(function initCtaParallax() {
  const ctaOrbs = document.querySelectorAll('.cta-orb');
  if (!ctaOrbs.length) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    ctaOrbs[0] && (ctaOrbs[0].style.transform = `translateY(${y * 0.04}px)`);
    ctaOrbs[1] && (ctaOrbs[1].style.transform = `translateY(${-y * 0.03}px)`);
  }, { passive: true });
})();


// ─────────────────────────────────────────────────
// LOG
// ─────────────────────────────────────────────────
console.log('%cCodeNoFrontier', 'font-size:20px; font-weight:800; color:#2563eb; font-family:system-ui');
console.log('%cBuilding the future, one line at a time.', 'color:#52525e; font-size:13px');

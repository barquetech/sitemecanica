(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ano no rodapé
  var anoEl = document.getElementById('anoAtual');
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // Menu mobile
  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  // Destaque do link ativo ao rolar
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav a');

  function destacarLink() {
    var pos = window.scrollY + 110;
    var atual = '';

    sections.forEach(function (sec) {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        atual = sec.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + atual);
    });
  }

  window.addEventListener('scroll', destacarLink, { passive: true });
  destacarLink();

  // Scroll reveal (leve) com stagger
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var siblings = Array.prototype.slice.call(el.parentElement.children).filter(function (c) {
            return c.hasAttribute('data-reveal');
          });
          var idx = siblings.indexOf(el);
          el.style.transitionDelay = Math.min(idx * 70, 350) + 'ms';
          el.classList.add('visible');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Parallax sutil do carro no hero
  var heroCar = document.getElementById('heroCar');

  if (heroCar && !prefersReduced) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroCar.style.transform = 'translateY(' + y * 0.12 + 'px)';
      }
    }, { passive: true });
  }

  // Slider de depoimentos
  var depoimentos = document.querySelectorAll('.depoimento');
  var depoNav = document.getElementById('depoNav');
  var indiceAtual = 0;

  function mostrarDepoimento(indice) {
    depoimentos.forEach(function (d, i) {
      d.classList.toggle('active', i === indice);
    });

    if (depoNav) {
      depoNav.querySelectorAll('.depo-btn').forEach(function (btn, i) {
        btn.classList.toggle('active', i === indice);
      });
    }
  }

  function avancarDepoimento() {
    indiceAtual = (indiceAtual + 1) % depoimentos.length;
    mostrarDepoimento(indiceAtual);
  }

  if (depoimentos.length && depoNav) {
    mostrarDepoimento(0);
    depoNav.addEventListener('click', function (e) {
      if (e.target.classList.contains('depo-btn')) {
        indiceAtual = parseInt(e.target.dataset.index, 10);
        mostrarDepoimento(indiceAtual);
      }
    });
    if (!prefersReduced) {
      setInterval(avancarDepoimento, 6000);
    }
  }

  // Formulário de contato (validação simples, sem servidor)
  var form = document.getElementById('contatoForm');
  var statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var valido = true;
      var nome = document.getElementById('nome');
      var email = document.getElementById('email');
      var tel = document.getElementById('telefone');

      [nome, email, tel].forEach(function (campo) {
        campo.classList.remove('invalid');
        if (campo.hasAttribute('required') && campo.value.trim() === '') {
          campo.classList.add('invalid');
          valido = false;
        }
      });

      var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      if (email.value.trim() === '' || !emailValido) {
        email.classList.add('invalid');
        valido = false;
      }

      if (!valido) {
        statusEl.textContent = 'Preencha os campos obrigatórios corretamente.';
        statusEl.className = 'form-status erro';
        return;
      }

      statusEl.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
      statusEl.className = 'form-status ok';
      form.reset();
    });
  }
})();

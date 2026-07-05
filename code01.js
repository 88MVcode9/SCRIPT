'use strict';

// ════════════════════════════════════════
// CONFIGURAÇÕES E CONSTANTES
// ════════════════════════════════════════
const categoryLabels = {
  storage: 'Armazenamento',
  ai: 'IA',
  gamer: 'Gamer',
  mini: 'Mini PC',
  network: 'Rede'
};

const categoryIcons = {
  storage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r="0.6" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="0.6" fill="currentColor" stroke="none"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>',
  gamer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><path d="M6 12h3M7.5 10.5v3"/><circle cx="15.5" cy="10.5" r="0.8" fill="currentColor" stroke="none"/><circle cx="17.5" cy="13" r="0.8" fill="currentColor" stroke="none"/></svg>',
  mini: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M5 8v4h14V8M12 12v4"/></svg>'
};

// ════════════════════════════════════════
// FUNÇÕES AUXILIARES (para tratar arrays de categoria)
// ════════════════════════════════════════
function getCategoryLabel(cat) {
  if (Array.isArray(cat)) return categoryLabels[cat[0]] || cat[0];
  return categoryLabels[cat] || cat;
}

function getCategoryClass(cat) {
  if (Array.isArray(cat)) return cat[0];
  return cat;
}

// ════════════════════════════════════════
// FUNÇÕES DE RENDERIZAÇÃO
// ════════════════════════════════════════
function placeholderHTML(category, title) {
  const words = title.split(' ').slice(0, 2).join(' ');
  const catKey = Array.isArray(category) ? category[0] : category;
  return `<div class="image-placeholder">${categoryIcons[catKey] || ''}<span>${words}</span></div>`;
}

window.handleImgError = function(imgEl) {
  const wrapper = imgEl.parentElement;
  const category = wrapper.dataset.category;
  const title = imgEl.getAttribute('alt') || '';
  imgEl.remove();
  wrapper.insertAdjacentHTML('afterbegin', placeholderHTML(category, title));
};

function imageBlock(item) {
  if (!item.image) return placeholderHTML(item.category, item.title);
  return `<img src="${item.image}" alt="${item.title}" loading="lazy" onerror="handleImgError(this)">`;
}

// ════════════════════════════════════════
// RENDERIZAÇÃO
// ════════════════════════════════════════
const container = document.getElementById('cards-container');
const totalSpan = document.getElementById('total-items');
const filterLabel = document.getElementById('active-filter-label');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderCards(itemsToRender) {
  if (itemsToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:5rem 2rem;color:#71717a;">
        <p style="font-size:1.4rem;font-weight:500;font-family:'Space Grotesk',sans-serif;">Nenhum componente encontrado nesta categoria.</p>
      </div>`;
    totalSpan.textContent = '0';
    return;
  }
  totalSpan.textContent = itemsToRender.length;

  container.innerHTML = itemsToRender.map((item, index) => {
    const catClass = getCategoryClass(item.category);
    const catLabel = getCategoryLabel(item.category);
    return `
    <div class="card ${catClass}" data-category="${catClass}" style="animation-delay: ${index * 0.05}s">
      <div class="electro-glow"></div>
      <div class="electro-aura"></div>
      <div class="shine-sweep"></div>
      <div class="image_container" data-category="${catClass}">
        ${imageBlock(item)}
        <div class="image-overlay"></div>
        <span class="category-tag">${catLabel}</span>
        <span class="quantity-badge">${item.quantity}</span>
      </div>
      <div class="title">${item.title}</div>
      <div class="specs-area">
        ${item.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
      </div>
      <div class="action">
        <span class="price-label">eBay</span>
        <button class="cart-button" onclick="window.open('${item.ebay}', '_blank')" title="Pesquisar no eBay">
          <svg class="cart-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Ver no eBay
        </button>
      </div>
    </div>`;
  }).join('');

  observeCards();
}

// ════════════════════════════════════════
// INTERSECTION OBSERVER
// ════════════════════════════════════════
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
let observer;

function setupObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
    return;
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
}

function observeCards() {
  if (!observer) setupObserver();
  if (!observer) return;

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => observer.observe(card));
}

// ════════════════════════════════════════
// FILTROS
// ════════════════════════════════════════
function filterCards(category) {
  filterButtons.forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.filter-btn[data-category="${category}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const filtered = category === 'all'
    ? items
    : items.filter(item => {
        const categories = Array.isArray(item.category) ? item.category : [item.category];
        return categories.includes(category);
      });

  renderCards(filtered);

  const labels = {
    all: 'Todos os sistemas',
    storage: 'Servidor Armazenamento',
    ai: 'Servidor IA',
    gamer: 'PC Gamer',
    mini: 'Mini PCs & Mac',
    network: 'Redes & Infra'
  };
  filterLabel.textContent = labels[category] || category;
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    filterCards(category);
  });
});

// ════════════════════════════════════════
// PARTÍCULAS DE FUNDO
// ════════════════════════════════════════
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
  }
}

// ════════════════════════════════════════
// CURSOR GLOW
// ════════════════════════════════════════
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top = glowY + 'px';
    requestAnimationFrame(animate);
  }
  animate();
}

// ════════════════════════════════════════
// CONTADORES ANIMADOS
// ════════════════════════════════════════
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(easeOut * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// ════════════════════════════════════════
// INICIALIZAÇÃO (quando o DOM estiver pronto)
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // Renderiza os cards
  renderCards(items);
  createParticles();
  initCursorGlow();
  filterLabel.textContent = 'Todos os sistemas';

  // Esconde a tela de loading após a página carregar
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loading = document.getElementById('loading');
      if (loading) loading.classList.add('hidden');
      animateCounters();
    }, 1800);
  });
});

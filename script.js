/* ==========================================================================
   ROUTE LIBRE — Executive Fleet, Live Quote Engine, Callbacks & Scroll-Spy
   ========================================================================== */

const FLEET = [
  {
    id: 'volta-e-compact',
    name: 'Volta E-Compact',
    category: 'Citadine',
    availability: 'Disponible aujourd’hui',
    energy: '100% Électrique',
    transmission: 'Automatique',
    seats: '5 places',
    power: '204 ch · 420 km WLTP',
    luggage: '3 valises',
    deposit: '600 €',
    pricePerDay: 78,
    image: './assets/citadine.jpg',
    description:
      'Silencieuse et agile, idéale pour circuler librement en centre-ville et prolonger le séjour sur les petites routes côtières.',
    perks: [
      'Badge recharge rapide inclus (Ionity & Fastned)',
      'Caméra 360° et Apple CarPlay / Android Auto sans fil',
      'Forfait 300 km/jour inclus'
    ]
  },
  {
    id: 'souveraine-s-line',
    name: 'Souveraine S-Line',
    category: 'Berline',
    availability: 'Disponible aujourd’hui',
    energy: 'Hybride',
    transmission: 'Automatique',
    seats: '5 places',
    power: '310 ch · 4,8 L/100',
    luggage: '4 valises',
    deposit: '1 200 €',
    pricePerDay: 165,
    image: './assets/berline.jpg',
    description:
      'Confort acoustique magistral et suspension pilotée pour les déplacements professionnels comme les longs trajets d’exception.',
    perks: [
      'Sellerie cuir Nappa et sièges ventilés',
      'Audio haute fidélité 15 haut-parleurs',
      'Facturation entreprise & livraison gare TGV'
    ]
  },
  {
    id: 'alpinia-rover-phev',
    name: 'Alpinia Rover PHEV',
    category: 'SUV',
    availability: 'Disponible aujourd’hui',
    energy: 'Hybride Rechargeable',
    transmission: '4×4 Auto',
    seats: '5 places',
    power: '360 ch · 4 roues motrices',
    luggage: '5 valises',
    deposit: '1 500 €',
    pricePerDay: 195,
    image: './assets/suv.jpg',
    description:
      'Transmission intégrale et volume généreux, pensée pour aborder sereinement les cols alpins, les stations ou les escapades familiales.',
    perks: [
      'Équipement hiver & chaînes disponibles sur demande',
      'Toit panoramique ouvrant et coffre mains libres',
      'Assistance montagne 24h/24 incluse'
    ]
  },
  {
    id: 'riviera-spider-65',
    name: 'Riviera Spider 65',
    category: 'Cabriolet',
    availability: 'Très demandé',
    energy: 'Essence',
    transmission: 'Manuelle Sport',
    seats: '2 places',
    power: '285 ch · Propulsion',
    luggage: '2 sacs week-end',
    deposit: '2 000 €',
    pricePerDay: 240,
    image: './assets/cabriolet.jpg',
    description:
      'L’icône des routes de Provence et de la Corniche d’Or : ligne intemporelle, sellerie cognac et plaisir mécanique pur.',
    perks: [
      'Capote souple à déploiement rapide',
      'Carnet d’itinéraires secrets en Provence offert',
      'Préparation esthétique main avant départ'
    ]
  },
  {
    id: 'atlantique-grand-van',
    name: 'Atlantique Grand Van',
    category: 'Van',
    availability: 'Disponible aujourd’hui',
    energy: 'Diesel Euro 6d',
    transmission: 'Automatique',
    seats: '7 places',
    power: '237 ch · Longue autonomie',
    luggage: '6 valises + coffre toit',
    deposit: '1 100 €',
    pricePerDay: 145,
    image: './assets/van.jpg',
    description:
      'Un salon roulant modulable doté d’un coffre de toit profilé pour emporter amis, famille, planches ou bagages sans compromis.',
    perks: [
      'Sièges individuels configurables face-à-face',
      'Coffre de toit aérodynamique inclus',
      '2e conducteur offert sur toutes durées'
    ]
  },
  {
    id: 'aurelia-gt-coupe',
    name: 'Aurelia GT Coupé',
    category: 'Berline',
    availability: 'Sur réservation',
    energy: 'Essence V8',
    transmission: 'Automatique 8 rap.',
    seats: '2+2 places',
    power: '460 ch · Grand Tourisme',
    luggage: '2 valises cabine',
    deposit: '2 500 €',
    pricePerDay: 290,
    image: './assets/hero.jpg',
    description:
      'Grand tourisme à l’état pur, taillé pour relier Nice à Saint-Tropez ou traverser la Bourgogne avec une élégance souveraine.',
    perks: [
      'Accueil privé au salon Route Libre',
      'Conciergerie itinéraire & réservations hôtels',
      'Assurance Sérénité tous risques incluse'
    ]
  }
];

const state = {
  category: 'Tous',
  sort: 'price-asc',
  agency: 'Paris — 8e (Champs-Élysées)',
  pickupDate: '',
  returnDate: '',
  days: 3,
  selectedCarId: 'riviera-spider-65',
  highlightedCarId: null,
  quoteRef: `RL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  addons: []
};

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatEuro(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(amount);
}

function computeDays(startStr, endStr) {
  if (!startStr || !endStr) return 3;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff >= 1 ? diff : 1;
}

function getSelectedCar() {
  return FLEET.find((c) => c.id === state.selectedCarId) || FLEET[0];
}

function computeAddonsTotal() {
  return state.addons.reduce((sum, addon) => {
    return sum + (addon.type === 'daily' ? addon.price * state.days : addon.price);
  }, 0);
}

function computeGrandTotal() {
  const car = getSelectedCar();
  return car.pricePerDay * state.days + computeAddonsTotal();
}

function initDates() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 2);
  const end = new Date(start);
  end.setDate(start.getDate() + 3);

  state.pickupDate = toDateInputValue(start);
  state.returnDate = toDateInputValue(end);
  state.days = 3;

  ['hero-pickup', 'form-pickup'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.min = toDateInputValue(today);
      el.value = state.pickupDate;
    }
  });
  ['hero-return', 'form-return'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.min = state.pickupDate;
      el.value = state.returnDate;
    }
  });
}

function syncDates(newStart, newEnd) {
  if (newStart) state.pickupDate = newStart;
  if (newEnd) state.returnDate = newEnd;

  const startObj = new Date(state.pickupDate);
  const endObj = new Date(state.returnDate);
  if (endObj <= startObj) {
    const adjusted = new Date(startObj);
    adjusted.setDate(startObj.getDate() + 1);
    state.returnDate = toDateInputValue(adjusted);
  }

  state.days = computeDays(state.pickupDate, state.returnDate);

  [
    ['hero-pickup', state.pickupDate],
    ['hero-return', state.returnDate],
    ['form-pickup', state.pickupDate],
    ['form-return', state.returnDate]
  ].forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el && el.value !== val) el.value = val;
  });

  const badge = document.getElementById('duration-badge');
  if (badge) {
    badge.textContent = `Tarifs affichés pour ${state.days} jour${state.days > 1 ? 's' : ''}`;
  }

  renderFleet();
  renderSummary();
}

function getFilteredFleet() {
  let items = [...FLEET];
  if (state.category !== 'Tous') {
    items = items.filter((car) => car.category === state.category);
  }
  if (state.sort === 'price-asc') {
    items.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (state.sort === 'price-desc') {
    items.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }
  return items;
}

function renderFleet() {
  const grid = document.getElementById('fleet-grid');
  if (!grid) return;

  const cars = getFilteredFleet();
  grid.innerHTML = cars
    .map((car) => {
      const total = car.pricePerDay * state.days;
      const isSelected = car.id === state.selectedCarId;
      const isHighlighted = car.id === state.highlightedCarId;
      return `
        <article class="car-card ${isHighlighted ? 'is-highlighted' : ''}" data-car-id="${car.id}">
          <div class="car-media">
            <img src="${car.image}" alt="${car.name} — ${car.category} Route Libre" loading="lazy" />
            <div class="car-media-badges">
              <span class="car-category-tag">${car.category}</span>
              <span class="car-status-tag">${car.availability}</span>
            </div>
          </div>
          <div class="car-body">
            <div class="car-header">
              <div>
                <h3 class="car-name">${car.name}</h3>
                <p class="car-energy">${car.energy}</p>
              </div>
              <div class="car-price-block">
                <div class="car-price">${formatEuro(car.pricePerDay)} <span>/ jour</span></div>
                <div class="car-total-estimate">${formatEuro(total)} pour ${state.days} j</div>
              </div>
            </div>
            <p class="car-desc">${car.description}</p>
            <div class="car-specs">
              <div class="spec-item">
                <span class="spec-label">Boîte</span>
                <span class="spec-val">${car.transmission}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Places</span>
                <span class="spec-val">${car.seats}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Caution</span>
                <span class="spec-val tabular">${car.deposit}</span>
              </div>
            </div>
            <div class="car-actions">
              <button type="button" class="btn btn-outline" data-action="details" data-car-id="${car.id}">
                Fiche détaillée
              </button>
              <button type="button" class="btn ${isSelected ? 'btn-accent' : 'btn-primary'}" data-action="select" data-car-id="${car.id}">
                ${isSelected ? 'Sélectionné' : 'Réserver'}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderSummary() {
  const car = getSelectedCar();
  const grandTotal = computeGrandTotal();

  const img = document.getElementById('summary-car-img');
  if (img) {
    img.src = car.image;
    img.alt = car.name;
  }
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText('summary-ref', `DEVIS #${state.quoteRef}`);
  setText('summary-car-name', car.name);
  setText('summary-car-meta', `${car.category} · ${car.energy} · ${car.transmission}`);
  setText('summary-agency', state.agency);
  setText('summary-dates', `${state.pickupDate} → ${state.returnDate} (${state.days} j)`);
  setText('summary-rate', `${formatEuro(car.pricePerDay)} × ${state.days} jour${state.days > 1 ? 's' : ''}`);
  setText('summary-deposit', car.deposit);
  setText('summary-total', formatEuro(grandTotal));

  const addonsRows = document.getElementById('summary-addons-rows');
  if (addonsRows) {
    addonsRows.innerHTML = state.addons
      .map((addon) => {
        const cost = addon.type === 'daily' ? addon.price * state.days : addon.price;
        const priceLabel = cost === 0 ? 'Offert' : `+${formatEuro(cost)}`;
        return `<div class="summary-row"><span>${addon.label}</span><strong>${priceLabel}</strong></div>`;
      })
      .join('');
  }

  const formCarSelect = document.getElementById('form-vehicle');
  if (formCarSelect && formCarSelect.value !== car.id) {
    formCarSelect.value = car.id;
  }

  // Sync dynamic WhatsApp pre-filled links
  const addonNames = state.addons.length
    ? ` | Options : ${state.addons.map((a) => a.label).join(', ')}`
    : '';
  const waMsg = encodeURIComponent(
    `Bonjour Route Libre, je souhaite un devis (${state.quoteRef}) pour la ${car.name} du ${state.pickupDate} au ${state.returnDate} (${state.days} j) au départ de ${state.agency}${addonNames}. Total estimé : ${formatEuro(grandTotal)}.`
  );
  const waUrl = `https://wa.me/33648127930?text=${waMsg}`;
  ['whatsapp-direct-link', 'fab-whatsapp-link'].forEach((id) => {
    const link = document.getElementById(id);
    if (link) link.href = waUrl;
  });
}

function openVehicleModal(carId) {
  const car = FLEET.find((c) => c.id === carId);
  if (!car) return;

  const backdrop = document.getElementById('vehicle-modal');
  document.getElementById('modal-img').src = car.image;
  document.getElementById('modal-img').alt = car.name;
  document.getElementById('modal-category').textContent = `${car.category} · ${car.energy} · ${car.availability}`;
  document.getElementById('modal-title').textContent = car.name;
  document.getElementById('modal-desc').textContent = car.description;
  document.getElementById('modal-power').textContent = car.power;
  document.getElementById('modal-transmission').textContent = car.transmission;
  document.getElementById('modal-seats').textContent = `${car.seats} · ${car.luggage}`;
  document.getElementById('modal-deposit').textContent = car.deposit;
  document.getElementById('modal-price').textContent = `${formatEuro(car.pricePerDay)} / jour`;
  document.getElementById('modal-total').textContent = `Soit ${formatEuro(car.pricePerDay * state.days)} estimés pour ${state.days} jour${state.days > 1 ? 's' : ''}`;
  document.getElementById('modal-perks').innerHTML = car.perks.map((p) => `<li>${p}</li>`).join('');
  document.getElementById('modal-book-btn').dataset.carId = car.id;

  backdrop.classList.add('is-open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeVehicleModal() {
  const backdrop = document.getElementById('vehicle-modal');
  backdrop.classList.remove('is-open');
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function selectCarAndScroll(carId) {
  state.selectedCarId = carId;
  renderFleet();
  renderSummary();
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateVehicleSelect() {
  const select = document.getElementById('form-vehicle');
  if (!select) return;
  select.innerHTML = FLEET.map(
    (car) => `<option value="${car.id}">${car.name} — ${formatEuro(car.pricePerDay)}/jour</option>`
  ).join('');
  select.value = state.selectedCarId;
}

function syncAddonsFromDom() {
  const checked = [];
  document.querySelectorAll('.addon-checkbox:checked').forEach((input) => {
    checked.push({
      id: input.dataset.addon,
      label: input.dataset.label,
      type: input.dataset.type,
      price: Number(input.dataset.price || 0)
    });
  });
  state.addons = checked;
  renderSummary();
}

function setupScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((sec) => observer.observe(sec));
}

function setupListeners() {
  // Sticky Header
  const header = document.getElementById('site-header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 36);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile Menu Drawer
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    const closeDrawer = () => {
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    mobileClose?.addEventListener('click', closeDrawer);
    mobileDrawer.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeDrawer));
  }

  // Hero Booking Console
  const heroForm = document.getElementById('hero-booking-form');
  const heroAgency = document.getElementById('hero-agency');
  const heroPickup = document.getElementById('hero-pickup');
  const heroReturn = document.getElementById('hero-return');
  const heroCategory = document.getElementById('hero-category');

  heroAgency?.addEventListener('change', (e) => {
    state.agency = e.target.value;
    const formAgency = document.getElementById('form-agency');
    if (formAgency) formAgency.value = state.agency;
    renderSummary();
  });

  heroPickup?.addEventListener('change', (e) => syncDates(e.target.value, state.returnDate));
  heroReturn?.addEventListener('change', (e) => syncDates(state.pickupDate, e.target.value));

  heroForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.agency = heroAgency.value;
    const formAgency = document.getElementById('form-agency');
    if (formAgency) formAgency.value = state.agency;
    syncDates(heroPickup.value, heroReturn.value);

    state.category = heroCategory.value;
    document.querySelectorAll('.filter-tab').forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.category === state.category);
    });
    renderFleet();
    document.getElementById('flotte')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Category Tabs
  document.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      state.category = tab.dataset.category;
      state.highlightedCarId = null;
      document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderFleet();
    });
  });

  // Sort Select
  document.getElementById('fleet-sort')?.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderFleet();
  });

  // Fleet Grid Actions
  document.getElementById('fleet-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, carId } = btn.dataset;
    if (action === 'details') openVehicleModal(carId);
    if (action === 'select') selectCarAndScroll(carId);
  });

  // Modal Controls
  document.getElementById('modal-close-btn')?.addEventListener('click', closeVehicleModal);
  document.getElementById('vehicle-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'vehicle-modal') closeVehicleModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVehicleModal();
  });
  document.getElementById('modal-book-btn')?.addEventListener('click', (e) => {
    const carId = e.currentTarget.dataset.carId;
    closeVehicleModal();
    selectCarAndScroll(carId);
  });

  // Road Trip Recommendations
  document.querySelectorAll('[data-recommend-car]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const carId = btn.dataset.recommendCar;
      state.category = 'Tous';
      state.highlightedCarId = carId;
      document.querySelectorAll('.filter-tab').forEach((t) => {
        t.classList.toggle('is-active', t.dataset.category === 'Tous');
      });
      renderFleet();
      document.querySelector(`.car-card[data-car-id="${carId}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    });
  });

  // Checkout Form Sync & Addons
  document.getElementById('form-vehicle')?.addEventListener('change', (e) => {
    state.selectedCarId = e.target.value;
    renderFleet();
    renderSummary();
  });
  document.getElementById('form-agency')?.addEventListener('change', (e) => {
    state.agency = e.target.value;
    if (heroAgency) heroAgency.value = state.agency;
    renderSummary();
  });
  document.getElementById('form-pickup')?.addEventListener('change', (e) =>
    syncDates(e.target.value, state.returnDate)
  );
  document.getElementById('form-return')?.addEventListener('change', (e) =>
    syncDates(state.pickupDate, e.target.value)
  );
  document.querySelectorAll('.addon-checkbox').forEach((box) => {
    box.addEventListener('change', syncAddonsFromDom);
  });

  // Copy & Print Quote Buttons
  document.getElementById('copy-quote-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const car = getSelectedCar();
    const total = computeGrandTotal();
    const addonsText = state.addons.length
      ? `\nOptions : ${state.addons.map((a) => a.label).join(', ')}`
      : '';
    const summaryText = `Devis Route Libre #${state.quoteRef}\nVéhicule : ${car.name} (${car.category})\nAgence : ${state.agency}\nPériode : ${state.pickupDate} → ${state.returnDate} (${state.days} j)${addonsText}\nTotal estimé TTC : ${formatEuro(total)}`;
    const confirmCopy = () => {
      const orig = btn.textContent;
      btn.textContent = 'Devis copié ✓';
      setTimeout(() => {
        btn.textContent = orig;
      }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText).then(confirmCopy).catch(confirmCopy);
    } else {
      confirmCopy();
    }
  });

  document.getElementById('print-quote-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Reservation Form Submit
  document.getElementById('reservation-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientName = document.getElementById('form-name')?.value.trim();
    const clientEmail = document.getElementById('form-email')?.value.trim();
    const clientPhone = document.getElementById('form-phone')?.value.trim();
    if (!clientName || !clientEmail) return;

    const car = getSelectedCar();
    const total = computeGrandTotal();
    const banner = document.getElementById('confirmation-banner');
    banner.innerHTML = `
      <strong>Pré-réservation enregistrée — Réf. ${state.quoteRef}</strong><br />
      Merci ${clientName}. Votre dossier pour la <strong>${car.name}</strong> (${state.days} j, total estimé <strong>${formatEuro(total)}</strong>, départ ${state.agency}) est pris en charge. Un conseiller Route Libre vous contactera sous 30 minutes au <strong>${clientPhone || clientEmail}</strong>.
    `;
    banner.classList.add('is-visible');
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Copy Contact Details Buttons
  document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.copy;
      const markCopied = () => {
        const orig = btn.textContent;
        btn.textContent = 'Copié ✓';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('is-copied');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(markCopied).catch(markCopied);
      } else {
        markCopied();
      }
    });
  });

  // Main "Vous n'avez pas de solde ?" Callback Form
  document.getElementById('callback-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const country = document.getElementById('callback-country')?.value || '';
    const phoneInput = document.getElementById('callback-phone');
    const nameInput = document.getElementById('callback-name');
    const slotSelect = document.getElementById('callback-slot');
    const feedback = document.getElementById('callback-feedback');
    const rawPhone = phoneInput?.value.trim();
    if (!rawPhone) return;

    const fullPhone = rawPhone.startsWith('+') ? rawPhone : `${country} ${rawPhone}`;
    const name = nameInput?.value.trim();
    const slot = slotSelect?.value || 'dès que possible (< 15 min)';
    const ref = `RL-RAPPEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const greeting = name ? `Merci ${name} ! ` : 'Merci ! ';

    feedback.innerHTML = `<strong>${greeting}Rappel gratuit programmé (${ref}).</strong><br />Un conseiller Route Libre vous rappellera gratuitement au <strong>${fullPhone}</strong> ${slot}.`;
    feedback.classList.add('is-visible');
    phoneInput.value = '';
    if (nameInput) nameInput.value = '';
  });

  // Floating Concierge Widget
  const conciergeFab = document.getElementById('concierge-fab');
  const conciergeTrigger = document.getElementById('concierge-trigger');
  const conciergeClose = document.getElementById('concierge-close');
  const conciergePopover = document.getElementById('concierge-popover');

  const setConciergeOpen = (open) => {
    if (!conciergeFab) return;
    conciergeFab.classList.toggle('is-open', open);
    conciergeTrigger?.setAttribute('aria-expanded', String(open));
    conciergePopover?.setAttribute('aria-hidden', String(!open));
  };

  conciergeTrigger?.addEventListener('click', () => {
    setConciergeOpen(!conciergeFab.classList.contains('is-open'));
  });
  conciergeClose?.addEventListener('click', () => setConciergeOpen(false));
  document.getElementById('fab-booking-link')?.addEventListener('click', () => setConciergeOpen(false));
  document.addEventListener('click', (e) => {
    if (conciergeFab && !conciergeFab.contains(e.target)) {
      setConciergeOpen(false);
    }
  });

  // Floating Quick "Pas de solde ?" Form
  document.getElementById('fab-callback-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneInput = document.getElementById('fab-callback-phone');
    const feedback = document.getElementById('fab-callback-feedback');
    const phone = phoneInput?.value.trim();
    if (!phone) return;
    feedback.textContent = `C’est noté ! Nous vous rappelons gratuitement au ${phone} sous 15 min.`;
    feedback.classList.add('is-visible');
    phoneInput.value = '';
  });

  // Scroll Reveal Observer
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  setupScrollSpy();
}

document.addEventListener('DOMContentLoaded', () => {
  initDates();
  populateVehicleSelect();
  renderFleet();
  renderSummary();
  setupListeners();
});

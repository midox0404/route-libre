/* ==========================================================================
   ROUTE LIBRE — Interactive Fleet, Estimator, Modal & Booking Logic
   ========================================================================== */

const FLEET = [
  {
    id: 'volta-e-compact',
    name: 'Volta E-Compact',
    category: 'Citadine',
    energy: '100% Électrique',
    transmission: 'Automatique',
    seats: '5 places',
    power: '204 ch · 420 km',
    luggage: '3 valises',
    deposit: '600 €',
    pricePerDay: 78,
    image: './assets/citadine.jpg',
    description:
      'Silencieuse et agile, idéale pour circuler librement en centre-ville et prolonger le séjour sur les petites routes côtières.',
    perks: [
      'Badge recharge rapide inclus (Ionity & Fastned)',
      'Caméra 360° et Apple CarPlay sans fil',
      'Kilométrage 300 km/jour inclus'
    ]
  },
  {
    id: 'souveraine-s-line',
    name: 'Souveraine S-Line',
    category: 'Berline',
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
      'Livraison possible en gare TGV ou hôtel'
    ]
  },
  {
    id: 'alpinia-rover-phev',
    name: 'Alpinia Rover PHEV',
    category: 'SUV',
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
      'Équipement hiver & chaînes sur demande',
      'Toit panoramique et attelage discret',
      'Assistance montagne 24h/24 incluse'
    ]
  },
  {
    id: 'riviera-spider-65',
    name: 'Riviera Spider 65',
    category: 'Cabriolet',
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
  highlightedCarId: null
};

// Format date as YYYY-MM-DD
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

function initDates() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 2);
  const end = new Date(start);
  end.setDate(start.getDate() + 3);

  state.pickupDate = toDateInputValue(start);
  state.returnDate = toDateInputValue(end);
  state.days = 3;

  const heroPickup = document.getElementById('hero-pickup');
  const heroReturn = document.getElementById('hero-return');
  const formPickup = document.getElementById('form-pickup');
  const formReturn = document.getElementById('form-return');

  [heroPickup, formPickup].forEach((el) => {
    if (el) {
      el.min = toDateInputValue(today);
      el.value = state.pickupDate;
    }
  });
  [heroReturn, formReturn].forEach((el) => {
    if (el) {
      el.min = state.pickupDate;
      el.value = state.returnDate;
    }
  });
}

function syncDates(newStart, newEnd) {
  if (newStart) state.pickupDate = newStart;
  if (newEnd) state.returnDate = newEnd;

  // Ensure return >= pickup + 1 day
  const startObj = new Date(state.pickupDate);
  const endObj = new Date(state.returnDate);
  if (endObj <= startObj) {
    const adjusted = new Date(startObj);
    adjusted.setDate(startObj.getDate() + 1);
    state.returnDate = toDateInputValue(adjusted);
  }

  state.days = computeDays(state.pickupDate, state.returnDate);

  const ids = [
    ['hero-pickup', state.pickupDate],
    ['hero-return', state.returnDate],
    ['form-pickup', state.pickupDate],
    ['form-return', state.returnDate]
  ];
  ids.forEach(([id, val]) => {
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
            <span class="car-category-tag">${car.category}</span>
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
                <span class="spec-label">Bagages</span>
                <span class="spec-val">${car.luggage.split(' ')[0]} ${car.luggage.split(' ')[1] || ''}</span>
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
  const car = FLEET.find((c) => c.id === state.selectedCarId) || FLEET[0];
  const img = document.getElementById('summary-car-img');
  const name = document.getElementById('summary-car-name');
  const meta = document.getElementById('summary-car-meta');
  const agency = document.getElementById('summary-agency');
  const dates = document.getElementById('summary-dates');
  const rate = document.getElementById('summary-rate');
  const total = document.getElementById('summary-total');
  const formCarSelect = document.getElementById('form-vehicle');

  if (img) {
    img.src = car.image;
    img.alt = car.name;
  }
  if (name) name.textContent = car.name;
  if (meta) meta.textContent = `${car.category} · ${car.energy} · ${car.transmission}`;
  if (agency) agency.textContent = state.agency;
  if (dates) {
    dates.textContent = `${state.pickupDate} → ${state.returnDate} (${state.days} j)`;
  }
  if (rate) rate.textContent = `${formatEuro(car.pricePerDay)} × ${state.days} jour${state.days > 1 ? 's' : ''}`;
  if (total) total.textContent = formatEuro(car.pricePerDay * state.days);
  if (formCarSelect && formCarSelect.value !== car.id) {
    formCarSelect.value = car.id;
  }
}

function openVehicleModal(carId) {
  const car = FLEET.find((c) => c.id === carId);
  if (!car) return;

  const backdrop = document.getElementById('vehicle-modal');
  document.getElementById('modal-img').src = car.image;
  document.getElementById('modal-img').alt = car.name;
  document.getElementById('modal-category').textContent = `${car.category} · ${car.energy}`;
  document.getElementById('modal-title').textContent = car.name;
  document.getElementById('modal-desc').textContent = car.description;
  document.getElementById('modal-power').textContent = car.power;
  document.getElementById('modal-transmission').textContent = car.transmission;
  document.getElementById('modal-seats').textContent = `${car.seats} · ${car.luggage}`;
  document.getElementById('modal-deposit').textContent = car.deposit;
  document.getElementById('modal-price').textContent = `${formatEuro(car.pricePerDay)} / jour`;
  document.getElementById('modal-total').textContent = `Soit ${formatEuro(car.pricePerDay * state.days)} estimés pour ${state.days} jour${state.days > 1 ? 's' : ''}`;

  const perksList = document.getElementById('modal-perks');
  perksList.innerHTML = car.perks.map((perk) => `<li>${perk}</li>`).join('');

  const bookBtn = document.getElementById('modal-book-btn');
  bookBtn.dataset.carId = car.id;

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
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function populateVehicleSelect() {
  const select = document.getElementById('form-vehicle');
  if (!select) return;
  select.innerHTML = FLEET.map(
    (car) => `<option value="${car.id}">${car.name} — ${formatEuro(car.pricePerDay)}/jour</option>`
  ).join('');
  select.value = state.selectedCarId;
}

function setupListeners() {
  // Sticky Header Scroll State
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
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
    mobileClose.addEventListener('click', closeDrawer);
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Hero Booking Bar
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

    const chosenCat = heroCategory.value;
    state.category = chosenCat;
    document.querySelectorAll('.filter-tab').forEach((tab) => {
      tab.classList.toggle('is-active', tab.dataset.category === chosenCat);
    });
    renderFleet();

    document.getElementById('flotte')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Category Filter Tabs
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

  // Fleet Grid Actions (Delegation)
  document.getElementById('fleet-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, carId } = btn.dataset;
    if (action === 'details') {
      openVehicleModal(carId);
    } else if (action === 'select') {
      selectCarAndScroll(carId);
    }
  });

  // Modal Close & Book
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

  // Road Trip Recommendations -> Highlight Car
  document.querySelectorAll('[data-recommend-car]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const carId = btn.dataset.recommendCar;
      state.category = 'Tous';
      state.highlightedCarId = carId;
      document.querySelectorAll('.filter-tab').forEach((t) => {
        t.classList.toggle('is-active', t.dataset.category === 'Tous');
      });
      renderFleet();
      const targetCard = document.querySelector(`.car-card[data-car-id="${carId}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // Contact / Reservation Form Sync
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

  // Contact Form Submission
  const reservationForm = document.getElementById('reservation-form');
  reservationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientName = document.getElementById('form-name').value.trim();
    const clientEmail = document.getElementById('form-email').value.trim();
    if (!clientName || !clientEmail) return;

    const car = FLEET.find((c) => c.id === state.selectedCarId) || FLEET[0];
    const ref = `RL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const banner = document.getElementById('confirmation-banner');
    banner.innerHTML = `
      <strong>Demande enregistrée (${ref})</strong><br />
      Merci ${clientName}. Votre pré-réservation pour la <strong>${car.name}</strong> (${state.days} jour${state.days > 1 ? 's' : ''}, départ ${state.agency}) a bien été simulée. Un conseiller Route Libre vous confirmerait la disponibilité à <em>${clientEmail}</em> sous 30 minutes.
    `;
    banner.classList.add('is-visible');
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Copy contact details buttons
  document.querySelectorAll('.copy-btn[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.copy;
      const markCopied = () => {
        const original = btn.textContent;
        btn.textContent = 'Copié ✓';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.textContent = original;
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

  // Callback request form ("Vous n'avez pas de solde ?")
  const callbackForm = document.getElementById('callback-form');
  callbackForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneInput = document.getElementById('callback-phone');
    const nameInput = document.getElementById('callback-name');
    const slotSelect = document.getElementById('callback-slot');
    const feedback = document.getElementById('callback-feedback');
    const phone = phoneInput?.value.trim();
    if (!phone) return;
    const name = nameInput?.value.trim();
    const slot = slotSelect?.value || 'dès que possible (< 15 min)';
    const ref = `RL-RAPPEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const greeting = name ? `Merci ${name} ! ` : 'Merci ! ';
    feedback.innerHTML = `<strong>${greeting}Votre demande de rappel gratuit est enregistrée (${ref}).</strong><br />Un conseiller Route Libre vous rappellera au <strong>${phone}</strong> ${slot}.`;
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

  // Quick "Pas de solde ?" callback form inside floating widget
  const fabCallbackForm = document.getElementById('fab-callback-form');
  fabCallbackForm?.addEventListener('submit', (e) => {
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
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initDates();
  populateVehicleSelect();
  renderFleet();
  renderSummary();
  setupListeners();
});

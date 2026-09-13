/* ==========================================================================
   HuntR Property Listings & Filter Controller
   Dynamic rendering, search syncing, category & location filters, modal view
   ========================================================================== */

let currentFilterType = 'All';      // 'All', 'Rent', 'Sale'
let currentLocation = 'All';        // 'All', 'Lekki', 'Ikoyi', etc.
let searchQuery = '';

function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || '';
}

function renderPropertyCard(prop) {
  return `
    <article class="property-card" data-id="${prop.id}">
      <div class="property-image-wrap">
        <img src="${prop.image}" alt="${prop.title}" class="property-thumb" loading="lazy" />
        <div class="property-badges-wrap">
          <span class="badge badge-chartreuse">0% Agent Cut</span>
          <span class="badge badge-dark">${prop.landlord.name.split('(')[0].trim()}</span>
        </div>
        <span class="property-type-tag">${prop.category} • ${prop.type}</span>
      </div>
      <div class="property-body">
        <div class="property-price">
          ${prop.priceFormatted} <span class="term">${prop.term}</span>
        </div>
        <h3 class="property-title">${prop.title}</h3>
        <div class="property-location">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>${prop.address}</span>
        </div>
        
        <div class="property-specs">
          <div class="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
            <span>${prop.bedrooms} Beds</span>
          </div>
          <div class="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1 0L3 6M12 21a6 6 0 0 0 6-6V9H6v6a6 6 0 0 0 6 6z"/></svg>
            <span>${prop.bathrooms} Baths</span>
          </div>
          <div class="spec-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            <span>${prop.parking} Cars</span>
          </div>
        </div>

        <div class="property-card-actions">
          <button class="btn btn-dark view-details-btn" onclick="openPropertyModal('${prop.id}')">
            View Details
          </button>
          <a href="https://wa.me/2348035550192?text=Hello%20HuntR,%20I%20am%20interested%20in%20inspecting%20${encodeURIComponent(prop.title)}%20(ID:%20${prop.id})%20directly%20from%20the%20owner." target="_blank" class="btn btn-olive">
            Direct Chat
          </a>
        </div>
      </div>
    </article>
  `;
}

function filterAndRenderProperties() {
  const container = document.getElementById('propertiesGrid');
  const countBadge = document.getElementById('listingsCount');
  if (!container) return;

  const filtered = HUNTR_PROPERTIES.filter(prop => {
    // Type match
    if (currentFilterType !== 'All' && prop.type !== currentFilterType) {
      return false;
    }
    // Location match
    if (currentLocation !== 'All' && !prop.neighborhood.toLowerCase().includes(currentLocation.toLowerCase())) {
      return false;
    }
    // Search query match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const combined = `${prop.title} ${prop.address} ${prop.neighborhood} ${prop.city} ${prop.category}`.toLowerCase();
      if (!combined.includes(q)) {
        return false;
      }
    }
    return true;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Direct Verified Properties Found`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #FFFFFF; border-radius: 16px; border: 1px solid var(--color-border);">
        <h3 style="margin-bottom: 8px;">No direct listings matched your search</h3>
        <p style="margin-bottom: 24px; color: var(--color-text-muted);">Try selecting another neighborhood or clearing your search term.</p>
        <button class="btn btn-dark" onclick="resetFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(renderPropertyCard).join('');
}

function resetFilters() {
  currentFilterType = 'All';
  currentLocation = 'All';
  searchQuery = '';

  document.querySelectorAll('.filter-pill-btn').forEach(btn => btn.classList.remove('active'));
  const allTypeBtn = document.querySelector('[data-type="All"]');
  const allLocBtn = document.querySelector('[data-loc="All"]');
  if (allTypeBtn) allTypeBtn.classList.add('active');
  if (allLocBtn) allLocBtn.classList.add('active');

  const pageSearch = document.getElementById('pageSearchInput');
  if (pageSearch) pageSearch.value = '';

  filterAndRenderProperties();
}

function openPropertyModal(propId) {
  const prop = HUNTR_PROPERTIES.find(p => p.id === propId);
  if (!prop) return;

  const modal = document.getElementById('propertyModal');
  const modalContent = document.getElementById('modalDynamicContent');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-image-container" style="position: relative;">
      <img src="${prop.image}" alt="${prop.title}" class="modal-hero-img" />
      <div style="position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px;">
        <span class="badge badge-chartreuse">₦0 Agent Fees</span>
        <span class="badge badge-dark">Verified Direct Owner</span>
      </div>
    </div>
    
    <div class="modal-body">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 16px;">
        <div>
          <span class="eyebrow">${prop.neighborhood} • ${prop.category}</span>
          <h2 style="font-size: 1.8rem; margin-top: 4px;">${prop.title}</h2>
          <p style="display: flex; align-items: center; gap: 6px; font-size: 0.95rem; color: var(--color-text-muted); margin-top: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${prop.address}
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; color: var(--color-text-primary);">
            ${prop.priceFormatted}
          </div>
          <span style="font-size: 0.9rem; color: var(--color-text-muted);">${prop.term}</span>
        </div>
      </div>

      <!-- Agent Fee Savings Alert Box -->
      <div style="background-color: var(--color-olive-light); border: 1px solid rgba(111, 116, 80, 0.3); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div style="font-weight: 700; color: var(--color-olive-dark); font-size: 0.95rem; margin-bottom: 4px;">
          🎉 Your Direct Hunter Savings: ${prop.agentFeeSaved}
        </div>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin: 0;">
          By connecting directly through HuntR, you avoid paying the standard 10% agency fee and 10% agreement fee charged by Nigerian agents.
        </p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="margin-bottom: 8px;">Property Overview</h4>
        <p style="color: var(--color-text-secondary);">${prop.description}</p>
      </div>

      <div style="margin-bottom: 28px;">
        <h4 style="margin-bottom: 12px;">Verified Amenities & Features</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
          ${prop.features.map(f => `
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem; background: var(--color-canvas); padding: 8px 12px; border-radius: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span>${f}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Direct Landlord Verified Profile Card -->
      <div style="background: var(--color-card); border: 1px solid var(--color-border); border-radius: 12px; padding: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-dark); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">
            ${prop.landlord.name.charAt(0)}
          </div>
          <div>
            <div style="font-weight: 700; font-size: 1rem;">${prop.landlord.name}</div>
            <div style="font-size: 0.8rem; color: var(--color-success); font-weight: 600;">✓ ${prop.landlord.verifiedTitle}</div>
            <div style="font-size: 0.75rem; color: var(--color-text-muted);">Sourced by: ${prop.hunterScout}</div>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <a href="tel:${prop.landlord.phone}" class="btn btn-outline" style="font-size: 0.85rem;">
            Call Direct
          </a>
          <a href="https://wa.me/2348035550192?text=Hello,%20I%20am%20viewing%20${encodeURIComponent(prop.title)}%20on%20HuntR%20and%20want%20to%20schedule%20a%20free%20direct%20inspection." target="_blank" class="btn btn-chartreuse" style="font-size: 0.85rem;">
            WhatsApp Owner
          </a>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button class="btn btn-outline" onclick="closePropertyModal()">Close</button>
        <button class="btn btn-dark" onclick="alert('Inspection requested! The property landlord and local HuntR scout have received your request. You will receive an SMS confirmation within 15 minutes with self-guided gate access pin.'); closePropertyModal();">
          Book Free Direct Inspection
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePropertyModal() {
  const modal = document.getElementById('propertyModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Read search query from URL if present (from navbar search)
  const qParam = getUrlParameter('q');
  if (qParam) {
    searchQuery = qParam;
    const pageSearch = document.getElementById('pageSearchInput');
    if (pageSearch) pageSearch.value = qParam;
  }

  // Type filter buttons (All, Rent, Sale)
  document.querySelectorAll('[data-type]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentFilterType = e.currentTarget.getAttribute('data-type');
      filterAndRenderProperties();
    });
  });

  // Location filter buttons
  document.querySelectorAll('[data-loc]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-loc]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentLocation = e.currentTarget.getAttribute('data-loc');
      filterAndRenderProperties();
    });
  });

  // Search input on listings page
  const pageSearch = document.getElementById('pageSearchInput');
  if (pageSearch) {
    pageSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRenderProperties();
    });
  }

  // Modal overlay click outside to close
  const modal = document.getElementById('propertyModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePropertyModal();
      }
    });
  }

  // Initial render
  filterAndRenderProperties();
});

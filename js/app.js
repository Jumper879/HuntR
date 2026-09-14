/* ==========================================================================
   HuntR Global Application Controller
   Mobile drawer, navbar scroll, FAQ accordion, Hunter upload handler, toasts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const stickyHeader = document.getElementById('huntrStickyHeader');
  const normalHeader = document.querySelector('.huntr-header:not(.huntr-sticky-header)');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (normalHeader) {
      if (scrollY > 40) {
        normalHeader.classList.add('scrolled');
      } else {
        normalHeader.classList.remove('scrolled');
      }
    }
    if (stickyHeader) {
      if (scrollY > 320) {
        stickyHeader.classList.add('visible');
      } else {
        stickyHeader.classList.remove('visible');
      }
    }
  }, { passive: true });

  // 2. Luxury Circular Menu & Drawer Toggle (Consistent across all pages)
  const menuButtons = document.querySelectorAll('.menu-circle-btn, #mobileMenuToggle');
  const drawer = document.getElementById('huntrDrawer') || document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (drawer) {
      drawer.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (backdrop) backdrop.classList.add('active');
    menuButtons.forEach(btn => {
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) {
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) backdrop.classList.remove('active');
    menuButtons.forEach(btn => {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.body.style.overflow = '';
  }

  menuButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer && drawer.classList.contains('active');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Close when clicking internal drawer links
  if (drawer) {
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });
  }

  // 3. FAQ Accordion Interaction
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      const isActive = parentItem.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });

  // 4. Hunter Bounty Submission Form (Get Paid page)
  const hunterForm = document.getElementById('hunterUploadForm');
  if (hunterForm) {
    hunterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const hunterName = document.getElementById('hunterName')?.value || 'Hunter';
      const propertyAddress = document.getElementById('propertyAddress')?.value || 'Property';
      const bankName = document.getElementById('hunterBank')?.value || 'Access Bank';
      const accountNumber = document.getElementById('hunterAccount')?.value || '0123456789';
      const bountyAmount = document.getElementById('formBountyEstimate')?.innerText || '₦120,000';

      const trackingCode = "HNTR-" + Math.floor(100000 + Math.random() * 900000);

      // Create Success Modal
      showBountySuccessModal({
        hunterName,
        propertyAddress,
        trackingCode,
        bankName,
        accountNumber,
        bountyAmount
      });

      hunterForm.reset();
    });
  }

  // 5. Contact Form Submission
  const contactForm = document.getElementById('huntrContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting HuntR! Your direct inquiry has been assigned to our Lagos & Abuja property team. We will respond via WhatsApp / Phone call within 30 minutes.');
      contactForm.reset();
    });
  }
});

function showBountySuccessModal(data) {
  let existingModal = document.getElementById('bountySuccessModal');
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div id="bountySuccessModal" class="modal-overlay open">
      <div class="modal-content-card" style="max-width: 540px; text-align: center; padding: 40px 32px;">
        <div style="width: 64px; height: 64px; background: var(--color-chartreuse); color: var(--color-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px;">
          ✓
        </div>
        <span class="eyebrow">BOUNTY UPLOAD SUBMITTED</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 12px;">Well Done, ${data.hunterName}!</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: 24px; font-size: 0.95rem;">
          Your spotted house at <strong>${data.propertyAddress}</strong> has been logged into the HuntR Field Dispatch network.
        </p>

        <div style="background: var(--color-canvas); border-radius: 12px; padding: 20px; border: 1px solid var(--color-border); text-align: left; margin-bottom: 24px; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-text-muted);">Tracking ID:</span>
            <strong>${data.trackingCode}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--color-text-muted);">Estimated Bounty:</span>
            <strong style="color: var(--color-success);">${data.bountyAmount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-text-muted);">Target Payout Bank:</span>
            <span>${data.bankName} (${data.accountNumber.slice(-4).padStart(data.accountNumber.length, '*')})</span>
          </div>
        </div>

        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 24px;">
          Our nearest field scout will physically visit within 24 hours to verify the landlord and title deeds. Once verified, your cash bounty will be deposited straight into your bank!
        </p>

        <button class="btn btn-dark" style="width: 100%;" onclick="document.getElementById('bountySuccessModal').remove();">
          Done & Return to Hunters Hub
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/* ==========================================================================
   HuntR Interactive Calculators
   1. Agent Fee Savings Calculator (10% agency + 10% legal fee bypassed)
   2. Hunter Bounty Earnings Calculator (Cash payouts for scouting homes)
   ========================================================================== */

function formatNaira(amount) {
  return "₦" + amount.toLocaleString('en-NG');
}

// ---------------------------------------------------------------------------
// 1. Agent Fee Savings Calculator
// ---------------------------------------------------------------------------
function initSavingsCalculator() {
  const slider = document.getElementById('rentPriceSlider');
  const rentDisplay = document.getElementById('sliderRentDisplay');
  const agencyFeeDisplay = document.getElementById('agencyFeeDisplay');
  const legalFeeDisplay = document.getElementById('legalFeeDisplay');
  const totalSavingsDisplay = document.getElementById('totalSavingsDisplay');

  if (!slider || !rentDisplay) return;

  function updateCalculations() {
    const rentVal = parseInt(slider.value, 10);
    const agencyFee = Math.round(rentVal * 0.10); // Standard 10% agent commission in Nigeria
    const legalFee = Math.round(rentVal * 0.10);  // Standard 10% agreement/legal fee
    const totalSaved = agencyFee + legalFee;

    rentDisplay.textContent = formatNaira(rentVal);
    if (agencyFeeDisplay) agencyFeeDisplay.textContent = formatNaira(agencyFee);
    if (legalFeeDisplay) legalFeeDisplay.textContent = formatNaira(legalFee);
    if (totalSavingsDisplay) totalSavingsDisplay.textContent = formatNaira(totalSaved);
  }

  slider.addEventListener('input', updateCalculations);
  updateCalculations(); // Run once on load
}

// ---------------------------------------------------------------------------
// 2. Hunter Bounty Calculator (Get Paid page)
// ---------------------------------------------------------------------------
function initBountyCalculator() {
  const propertyTierSelect = document.getElementById('bountyPropertyTier');
  const volumeSlider = document.getElementById('bountyVolumeSlider');
  const volumeDisplay = document.getElementById('bountyVolumeDisplay');
  const monthlyBountyDisplay = document.getElementById('monthlyBountyDisplay');
  const annualBountyDisplay = document.getElementById('annualBountyDisplay');

  if (!propertyTierSelect || !volumeSlider) return;

  function updateBounty() {
    const baseBounty = parseInt(propertyTierSelect.value, 10);
    const count = parseInt(volumeSlider.value, 10);
    const monthlyTotal = baseBounty * count;
    const annualTotal = monthlyTotal * 12;

    if (volumeDisplay) volumeDisplay.textContent = count + (count === 1 ? " property" : " properties");
    if (monthlyBountyDisplay) monthlyBountyDisplay.textContent = formatNaira(monthlyTotal);
    if (annualBountyDisplay) annualBountyDisplay.textContent = formatNaira(annualTotal);
  }

  propertyTierSelect.addEventListener('change', updateBounty);
  volumeSlider.addEventListener('input', updateBounty);
  updateBounty();
}

document.addEventListener('DOMContentLoaded', () => {
  initSavingsCalculator();
  initBountyCalculator();
});

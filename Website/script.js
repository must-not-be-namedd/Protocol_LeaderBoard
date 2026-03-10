/* script.js
   - Countdown reads the event datetime from #countdown[data-event]
   - Replace the data-event value in index.html to change the event date/time
*/

document.addEventListener('DOMContentLoaded', () => {

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Global Warm-up (Non-blocking)
  const BACKEND_URL = 'https://protocol-backend-idxa.onrender.com';
  fetch(`${BACKEND_URL}/api/health`).catch(() => {});

  // ================================
  // COUNTDOWN TIMER
  // ================================

  const countdownEl = document.getElementById('countdown');

  // Set event 7 days from now (modify here if needed)
  const eventDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {

    const now = new Date().getTime();
    const diff = eventDate.getTime() - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / (1000 * 60)) % 60;
    const hr = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hr).padStart(2, '0');
    minutesEl.textContent = String(min).padStart(2, '0');
    secondsEl.textContent = String(sec).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  // ================================
  // GAME CARD KEYBOARD ACCESSIBILITY
  // ================================

  document.querySelectorAll('.game-card').forEach(card => {

    card.setAttribute('tabindex', '0');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

  });


  // ================================
  // SEMESTER TOGGLE
  // ================================

  document.querySelectorAll(".semester-toggle").forEach(btn => {

    btn.addEventListener("click", () => {

      const card = btn.parentElement;
      const grid = card.querySelector(".subjects-grid");

      card.classList.toggle("open");

      grid.style.display =
        grid.style.display === "grid" ? "none" : "grid";

    });

  });

});
